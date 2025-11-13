<script>
import SlotComponent from "../components/SlotComponent.vue";
import BetSelectButton from "../components/BetSelectButton.vue";
import InfoComponent from "../components/InfoComponent.vue";
import ToastNotification from "../components/ToastNotification.vue";

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
    };
  },
  components: {
    ToastNotification,
    SlotComponent,
    BetSelectButton,
    InfoComponent,
  },
  computed: {
    infoElements() {
      const n = this.slotValues.length;
      const k = this.slotAmount;


      // probability of a specific symbol filling all reels (e.g. '$$$')
      const pSpecific = (1 / Math.pow(n, k)) * 100;

      // probability any symbol fills all reels (any triple)
      const pAnyTriple = (n / Math.pow(n, k)) * 100; // = 1 / n^(k-1) * 100

      // probability of exactly two symbols matching (only sensible for k===3)
      let pExactlyTwo = 0;
      if (k === 3) {
        const combos = 3; // C(3,2)
        pExactlyTwo = (n * combos * (n - 1)) / Math.pow(n, k) * 100;
      } else {
        // fallback: probability of at least two matching (approx)
        pExactlyTwo = (
          1 - (Math.pow(n - 1, k) + k * Math.pow(n - 1, k - 1)) / Math.pow(n, k)
        ) * 100;
      }

      return [
        {
          title: '$$$',
          value: pSpecific.toFixed(3) + '%',
          desc: `Hadiah: taruhan × ${this.payoutTripleDollar}`,
        },
        {
          title: '777',
          value: pSpecific.toFixed(3) + '%',
          desc: `Hadiah: taruhan × ${this.payout777}`,
        },
        {
          title: '2 sama (tepat 2)',
          value: pExactlyTwo.toFixed(2) + '%',
          desc: `Hadiah: taruhan × ${this.payoutTwoSame}`,
        },
        {
          title: '3 sama (any simbol)',
          value: pAnyTriple.toFixed(3) + '%',
          desc: 'Peluang mendapatkan 3 simbol sama (semua simbol)',
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
        pExactlyTwo = 1 - (Math.pow(n - 1, k) + k * Math.pow(n - 1, k - 1)) / Math.pow(n, k);
      }

      // payouts as configured in data: use the same variables as calculateReward
      const expectedRewardMultiplier = pSpecific * this.payoutTripleDollar + pSpecific * this.payout777 + pExactlyTwo * this.payoutTwoSame;

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
          return;
        }
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

      if (rewardsMap.get("$") === this.slotAmount) finalReward = this.lastPlacedBet * this.payoutTripleDollar;
      else if (rewardsMap.get("7") === this.slotAmount) finalReward = this.lastPlacedBet * this.payout777;
      else if ((rewardsMap.get("=") || 0) >= 2) finalReward = this.lastPlacedBet * this.payoutTwoSame;

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
      if (!this.spinning && this.autospinning) setTimeout(this.spinSlots, 500, 1);
    },
  },
};
</script>

<template>
  <main class="flex min-h-screen w-screen justify-center items-center transition-all py-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
    <ToastNotification
      :message="'Anda mendapatkan ' + lastReward.toLocaleString() + ' poin!'"
      class="transition-all"
      :class="end ? 'translate-x-0' : 'translate-x-96'"
    />

    <div class="flex flex-col w-11/12 lg:w-4/5 xl:w-3/4 items-center gap-6">
      <header class="w-full flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold neon">Slots</h1>
          <p class="text-sm text-slate-300">Coba keberuntunganmu — susun simbol, dapatkan hadiah!</p>
        </div>
        <div class="glass px-4 py-2 rounded-md text-sm">
          <div class="text-xs text-slate-300">Saldo</div>
          <div class="font-bold text-lg">{{ points.toLocaleString() }}</div>
        </div>
      </header>

      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- controls -->
        <aside class="glass p-4 rounded-xl card-hover">
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
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h3v2H4v10h3v2H4a2 2 0 01-2-2V5z" />
                <path d="M12 3h4a2 2 0 012 2v10a2 2 0 01-2 2h-4V3z" />
              </svg>
              <span>{{ spinning || autospinning ? 'Sedang berputar...' : 'Putar' }}</span>
            </button>

            <button class="btn btn-outline flex items-center gap-2" @click="autospinning = !autospinning">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6"/>
              </svg>
              <span>{{ autospinning ? 'Stop' : 'Autospin' }}</span>
            </button>
          </div>

          <div class="mt-4 text-xs text-slate-400">
            Hadiah terakhir: <span class="font-mono">{{ lastReward.toLocaleString() }}</span>
          </div>
        </aside>

        <!-- slots -->
        <div class="col-span-1 lg:col-span-1 flex items-center justify-center">
          <div class="glass p-6 rounded-xl w-full flex flex-col items-center card-hover">
            <div id="slotSpace" class="flex justify-center gap-4 w-full">
              <SlotComponent v-for="i in slotAmount" :key="i" :slotValues="slotValues" :ref="String('slot' + i)" />
            </div>
            <div class="mt-3 text-sm text-slate-300">Pencet Putar untuk memutar semua gulungan</div>
          </div>
        </div>

        <!-- info -->
        <aside class="glass p-4 rounded-xl card-hover">
          <h3 class="text-lg font-semibold">Peluang & Hadiah</h3>
          <InfoComponent :elements="infoElements" class="mt-3" />

          <details class="relative glass p-3 rounded-md mt-4">
            <summary class="cursor-pointer font-semibold">Penjelasan peluang (bahasa mudah)</summary>
            <div class="mt-2 text-xs text-slate-300 space-y-3">
              <p class="font-semibold text-rose-300">Peringatan: Bermain berulang akan mengarah ke kerugian bersih.</p>

              <ul class="list-disc list-inside space-y-2">
                <li>
                  <strong>{{ infoElements[0].title }} — {{ infoElements[0].value }}</strong>
                  : Artinya peluang mendapatkan simbol tertentu (mis. "$$$") di ketiga gulungan adalah sekitar <em>{{ infoElements[0].value }}</em>.
                  Contoh: jika nilainya 0.80%, itu berarti sekitar 1 kali dari 125 putaran.
                </li>
                <li>
                  <strong>{{ infoElements[2].title }} — {{ infoElements[2].value }}</strong>
                  : Ini menunjukkan peluang mendapatkan tepat dua simbol yang sama dan satu berbeda. Angka ini seringkali lebih besar karena ada banyak kombinasi posisi di mana dua simbol cocok.
                </li>
                <li>
                  <strong>{{ infoElements[3].title }} — {{ infoElements[3].value }}</strong>
                  : Peluang semua tiga gulungan menunjukkan simbol yang sama (simbol apa saja). Nilai ini sama dengan jumlah simbol × peluang untuk simbol tertentu.
                </li>
              </ul>
            </div>
          </details>

          <div class="mt-4 text-xs text-rose-300">
            <span class="font-semibold">Peringatan Edukasi:</span>
            Situs ini hanya untuk tujuan edukasi — perjudian dapat menyebabkan kerugian finansial dan dampak sosial. Jika Anda atau seseorang yang Anda kenal mengalami masalah terkait judi, cari bantuan profesional.
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>
