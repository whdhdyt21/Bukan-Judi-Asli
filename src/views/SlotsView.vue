<script>
import SlotComponent from "../components/SlotComponent.vue";
import BetSelectButton from "../components/BetSelectButton.vue";
import InfoComponent from "../components/InfoComponent.vue";
import ToastNotification from "../components/ToastNotification.vue";
import { RouterLink } from "vue-router";

export default {
  props: ["points"],
  data() {
    return {
      slotSpinTimes: 10,
      slotAmount: 3,
      spinning: false,
      slotBets: [2000, 5000, 10000, 20000],
      selectedBet: 2000,
      slotValues: ["$", "0", "7", "-", "="],
      // configurable payouts (use these to tune RTP / house edge)
      // We'll set payouts so the house wins in the long run.
      // Recommended values chosen below give approximate RTP ≈ 92.0%.
      payoutTripleDollar: 27,
      payout777: 28,
      payoutTwoSame: 1,
      lastPlacedBet: 0,
      lastReward: 0,
      autospinning: false,
      buttonSound: new Audio("spin.mp3"),
      end: false,
      outOfBalance: false,
    };
  },
  components: {
    ToastNotification,
    SlotComponent,
    BetSelectButton,
    InfoComponent,
    RouterLink,
  },
  computed: {
    infoElements() {
      const n = this.slotValues.length;
      const k = this.slotAmount;

      // probability of a specific symbol filling all reels (e.g. '$$$')
      const pSpecific = (1 / Math.pow(n, k)) * 100;

      // probability of exactly two symbols matching (only sensible for k===3)
      let pExactlyTwo = 0;
      if (k === 3) {
        const combos = 3; // C(3,2)
        pExactlyTwo = ((n * combos * (n - 1)) / Math.pow(n, k)) * 100;
      } else {
        // fallback: probability of at least two matching (approx)
        pExactlyTwo =
          (1 -
            (Math.pow(n - 1, k) + k * Math.pow(n - 1, k - 1)) /
              Math.pow(n, k)) *
          100;
      }

      return [
        {
          title: "$$$",
          value: pSpecific.toFixed(2) + "%",
          payout: `Bayar ${this.payoutTripleDollar}× taruhan`,
          note: "Tiga simbol $ sejajar",
        },
        {
          title: "777",
          value: pSpecific.toFixed(2) + "%",
          payout: `Bayar ${this.payout777}× taruhan`,
          note: "Tiga angka 7 sejajar",
        },
        {
          title: "2 sama",
          value: pExactlyTwo.toFixed(0) + "%",
          payout: `Bayar ${this.payoutTwoSame}× taruhan`,
          note: "Tepat dua simbol sama",
        },
      ];
    },
    evInfo() {
      // compute EV based on the same probabilities used in infoElements
      const n = this.slotValues.length;
      const k = this.slotAmount;

      const pSpecific = 1 / Math.pow(n, k); // fraction

      // probability of exactly two matching (for k===3)
      let pExactlyTwo = 0;
      if (k === 3) {
        const combos = 3; // positions for the lone symbol
        pExactlyTwo = (n * combos * (n - 1)) / Math.pow(n, k); // fraction
      } else {
        // approximate fallback as fraction
        pExactlyTwo =
          1 -
          (Math.pow(n - 1, k) + k * Math.pow(n - 1, k - 1)) / Math.pow(n, k);
      }

      // payouts as configured in data: use the same variables as calculateReward
      const expectedRewardMultiplier =
        pSpecific * this.payoutTripleDollar +
        pSpecific * this.payout777 +
        pExactlyTwo * this.payoutTwoSame;

      const evMultiplier = expectedRewardMultiplier - 1; // expected net fraction of bet
      const placed = Number(this.selectedBet || this.slotBets[0]);
      const evAmount = Math.round(evMultiplier * placed);
      return { amount: evAmount, percent: evMultiplier * 100 };
    },
  },
  methods: {
    onBetChange(val) {
      this.selectedBet = Number(val);
    },
    spinSlots(slotCounter, rewards = []) {
      if (slotCounter === 1) {
        this.lastPlacedBet = Number(this.$refs.betSelect.$data.value);
        if (this.points - this.lastPlacedBet < 0) {
          this.autospinning = false;
          this.outOfBalance = true;
          return;
        }
        this.outOfBalance = false;
        this.$emit("changePoints", -this.lastPlacedBet);
        try {
          this.buttonSound.currentTime = 0;
          this.buttonSound.play();
        } catch (e) {
          // ignore autoplay errors
        }
      } else if (slotCounter > this.slotAmount) {
        this.spinning = false;
        this.calculateReward(rewards);
        return;
      }

      this.spinning = true;
      this.$refs["slot" + slotCounter][0]
        .spin(this.slotSpinTimes)
        .then((res) => {
          rewards.push(res);
          this.spinSlots(slotCounter + 1, rewards);
        });
    },
    calculateReward(rewards) {
      const rewardsMap = rewards.reduce(
        (map, reward) => map.set(reward, (map.get(reward) || 0) + 1),
        new Map()
      );
      let finalReward = 0;

      if (rewardsMap.get("$") === this.slotAmount)
        finalReward = this.lastPlacedBet * this.payoutTripleDollar;
      else if (rewardsMap.get("7") === this.slotAmount)
        finalReward = this.lastPlacedBet * this.payout777;
      // exactly two matching symbols (any symbol): matches the displayed
      // probability and the advertised RTP. Three identical non-$/7 symbols
      // pay nothing, consistent with the odds shown to the player.
      else if ([...rewardsMap.values()].some((count) => count === 2))
        finalReward = this.lastPlacedBet * this.payoutTwoSame;

      this.end = true;
      this.lastReward = finalReward;
      this.$emit("changePoints", finalReward);
      setTimeout(() => {
        this.end = false;
      }, 3000);
    },
  },
  watch: {
    autospinning: function autospinWatch() {
      if (!this.spinning && this.autospinning) this.spinSlots(1);
    },
    spinning: function spinWatch() {
      if (!this.spinning && this.autospinning)
        setTimeout(this.spinSlots, 500, 1);
    },
  },
};
</script>

<template>
  <main
    class="flex min-h-screen w-full justify-center items-start transition-all py-8"
  >
    <ToastNotification
      :message="'Anda mendapatkan ' + lastReward.toLocaleString() + ' poin!'"
      class="transition-all"
      :class="end ? 'translate-x-0' : 'translate-x-96'"
    />

    <div
      class="flex flex-col w-11/12 lg:w-4/5 xl:w-3/4 max-w-7xl items-center gap-6"
    >
      <header class="w-full flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold neon">Slots</h1>
          <p class="text-sm text-slate-300">
            Coba keberuntunganmu: susun simbol, dapatkan hadiah!
          </p>
        </div>
        <div class="glass px-4 py-2 rounded-md text-sm">
          <div class="text-xs text-slate-300">Saldo</div>
          <div class="font-bold text-base">{{ points.toLocaleString() }}</div>
        </div>
      </header>

      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- controls -->
        <aside class="glass p-4 rounded-xl">
          <div class="text-sm text-slate-300">Taruhan</div>
          <BetSelectButton
            :bets="slotBets"
            :disabled="spinning || autospinning"
            id="betSelect"
            ref="betSelect"
            class="mt-2"
            @change="onBetChange"
          />

          <div class="mt-4 flex gap-3">
            <button
              class="btn btn-primary glow flex-1 flex items-center justify-center gap-2"
              @click="spinSlots(1)"
              :disabled="spinning || autospinning"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h3v2H4v10h3v2H4a2 2 0 01-2-2V5z" />
                <path d="M12 3h4a2 2 0 012 2v10a2 2 0 01-2 2h-4V3z" />
              </svg>
              <span>{{
                spinning || autospinning ? "Sedang berputar..." : "Putar"
              }}</span>
            </button>

            <button
              class="btn btn-outline flex items-center gap-2"
              @click="autospinning = !autospinning"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v6h6M20 20v-6h-6"
                />
              </svg>
              <span>{{ autospinning ? "Stop" : "Autospin" }}</span>
            </button>
          </div>

          <div class="mt-4 text-xs text-slate-400">
            Hadiah terakhir:
            <span class="font-mono">{{ lastReward.toLocaleString() }}</span>
          </div>
        </aside>

        <!-- slots -->
        <div class="col-span-1 lg:col-span-1 flex items-center justify-center">
          <div class="glass p-6 rounded-xl w-full flex flex-col items-center">
            <div id="slotSpace" class="flex justify-center gap-4 w-full">
              <SlotComponent
                v-for="i in slotAmount"
                :key="i"
                :slotValues="slotValues"
                :ref="String('slot' + i)"
              />
            </div>
            <div class="mt-3 text-sm text-slate-300">
              Pencet Putar untuk memutar semua gulungan
            </div>
            <div
              v-if="outOfBalance"
              class="mt-3 p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-sm text-rose-200 text-center"
            >
              Saldo demo habis. Inilah yang terjadi di dunia nyata: house edge
              perlahan menghabiskan modal pemain.
              <RouterLink to="/edukasi" class="underline font-semibold"
                >Pelajari kenapa &rarr;</RouterLink
              >
            </div>
          </div>
        </div>

        <!-- info -->
        <aside class="glass p-4 rounded-xl flex flex-col gap-4">
          <InfoComponent :elements="infoElements" />

          <!-- Expected Value: inti edukasi, pemain rugi rata-rata tiap putaran -->
          <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <div class="text-xs text-slate-300">
              Nilai harapan (EV) per putaran
            </div>
            <div
              class="text-2xl font-black"
              :class="evInfo.amount < 0 ? 'text-rose-400' : 'text-emerald-400'"
            >
              {{ evInfo.amount > 0 ? "+" : ""
              }}{{ evInfo.amount.toLocaleString() }}
              <span class="text-xs font-semibold text-slate-400"
                >({{ evInfo.percent.toFixed(1) }}%)</span
              >
            </div>
            <div class="text-[11px] text-slate-400 mt-1 leading-snug">
              Rata-rata, taruhan {{ selectedBet.toLocaleString() }} berakhir
              rugi setiap putaran. Itulah keunggulan rumah.
            </div>
          </div>

          <details class="rounded-lg bg-white/5 border border-white/10 p-3">
            <summary
              class="cursor-pointer text-sm font-semibold text-slate-200"
            >
              Cara membaca angka ini
            </summary>
            <div class="mt-2 text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                Hadiah
                <strong class="text-amber-200">{{ payout777 }}×</strong>
                terlihat menggoda, tapi peluangnya hanya
                <strong class="text-rose-300">{{
                  infoElements[0].value
                }}</strong
                >, yaitu sekitar 1 kali dari 125 putaran.
              </p>
              <p>
                Kombinasi yang lebih sering muncul (dua simbol sama) hanya
                membayar
                <strong class="text-amber-200">{{ payoutTwoSame }}×</strong>,
                jauh lebih kecil dari taruhan Anda.
              </p>
              <p class="text-rose-300 font-semibold">
                Semakin sering bermain, semakin pasti Anda merugi.
              </p>
            </div>
          </details>

          <p class="text-xs text-rose-300/90 leading-snug">
            <span class="font-semibold">Peringatan:</span>
            ini simulasi edukasi. Perjudian nyata dapat menyebabkan kerugian
            finansial dan sosial. Butuh bantuan? Hubungi 119 ext. 8.
          </p>
        </aside>
      </div>
    </div>
  </main>
</template>
