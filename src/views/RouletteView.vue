<script>
import BetSelectButton from "../components/BetSelectButton.vue";
import Roulette from "../components/RouletteComponent.vue";
import ToastNotification from "../components/ToastNotification.vue";
import InfoComponent from "../components/InfoComponent.vue";
import { RouterLink } from "vue-router";

export default {
  props: ["points"],
  data() {
    return {
      // bets presented to the player
      rouletteBets: [10000, 25000, 50000, 100000],
      selectedBet: 10000,
      autospinning: false,
      lastReward: 0,
      spinning: false,
      colors: ["light-blue", "dark-blue"],
      // simple audio; expects `spin.mp3` to be available in `public/`
      buttonSound: new Audio("spin.mp3"),
      end: false,
      outOfBalance: false,
    };
  },
  components: {
    BetSelectButton,
    Roulette,
    ToastNotification,
    InfoComponent,
    RouterLink,
  },
  computed: {
    infoElements() {
      const n = this.colors.length || 2;
      const p = (1 / n) * 100;
      const pct = p.toFixed(0) + "%";
      return [
        {
          title: "Biru muda",
          value: pct,
          payout: "Bayar 1,5× taruhan",
          note: "Tebak warna biru muda",
        },
        {
          title: "Biru tua",
          value: pct,
          payout: "Bayar 1,5× taruhan",
          note: "Tebak warna biru tua",
        },
      ];
    },
    evInfo() {
      // selectedBet is reactive and updated via BetSelectButton change event
      const placed = Number(this.selectedBet || this.rouletteBets[0]);
      const winProb = 1 / (this.colors.length || 2);
      const payout = 1.5; // current payout multiplier used in spinRoulette
      const evMultiplier = payout * winProb - 1; // expected net fraction of bet
      const evAmount = Math.round(evMultiplier * placed);
      const evPercent = evMultiplier * 100;
      return { amount: evAmount, percent: evPercent };
    },
  },
  methods: {
    onBetChange(val) {
      this.selectedBet = Number(val);
    },
    spinRoulette() {
      const placedBet = Number(this.$refs.betSelect.$data.value);

      if (this.points - placedBet < 0) {
        this.autospinning = false;
        this.outOfBalance = true;
        return;
      }
      this.outOfBalance = false;

      this.spinning = true;
      this.$emit("changePoints", -placedBet);
      try {
        this.buttonSound.currentTime = 0;
        this.buttonSound.play();
      } catch (e) {
        // ignore audio autoplay restrictions
      }

      const chosenColor = this.$refs.colorSelect.$data.value;

      this.$refs.roulette.spin().then((res) => {
        this.end = true;
        if (res === chosenColor) {
          const reward = Math.floor(placedBet * 1.5);
          this.$emit("changePoints", reward);
          this.lastReward = reward;
        } else {
          this.lastReward = 0;
        }
        this.spinning = false;
        setTimeout(() => {
          this.end = false;
        }, 2500);
      });
    },
  },
  watch: {
    autospinning: function autospinWatch() {
      if (!this.spinning && this.autospinning) this.spinRoulette();
    },
    spinning: function spinWatch() {
      if (!this.spinning && this.autospinning)
        setTimeout(this.spinRoulette, 900);
    },
  },
};
</script>

<template>
  <main
    class="flex min-h-screen w-full justify-center items-start transition-all py-8"
  >
    <!-- toast / reward -->
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
          <h1 class="text-3xl font-extrabold neon">Roulette</h1>
          <p class="text-sm text-slate-300">
            Putar roda, pilih warna, menangkan poin!
          </p>
        </div>
        <div class="glass px-4 py-2 rounded-md text-sm">
          <div class="text-xs text-slate-300">Saldo</div>
          <div class="font-bold text-lg">{{ points.toLocaleString() }}</div>
        </div>
      </header>

      <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- left: controls -->
        <aside class="glass p-4 rounded-xl">
          <div class="text-sm text-slate-300">Taruhan</div>
          <BetSelectButton
            :bets="rouletteBets"
            :disabled="spinning || autospinning"
            id="betSelect"
            ref="betSelect"
            class="mt-2"
            @change="onBetChange"
          />

          <div class="mt-4 flex gap-3">
            <button
              class="btn btn-primary glow flex-1 flex items-center justify-center gap-2"
              @click="spinRoulette"
              :disabled="spinning || autospinning"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v3a1 1 0 00.293.707l2 2a1 1 0 001.414-1.414L11 7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{
                spinning || autospinning ? "Berputar..." : "Putar"
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

          <div class="mt-4">
            <div class="text-sm text-slate-300">Pilih Warna</div>
            <BetSelectButton
              title="Warna"
              :bets="colors"
              :disabled="spinning || autospinning"
              id="colorSelect"
              ref="colorSelect"
              class="mt-2"
            />
          </div>

          <div class="mt-4 text-xs text-slate-400">
            Hadiah terakhir:
            <span class="font-mono">{{ lastReward.toLocaleString() }}</span>
          </div>
        </aside>

        <!-- center: roulette wheel -->
        <div class="col-span-1 lg:col-span-1 flex items-center justify-center">
          <div class="glass p-6 rounded-xl w-full flex flex-col items-center">
            <Roulette class="!m-0 w-full max-w-md" ref="roulette" />
            <div class="mt-3 text-sm text-slate-300">
              Pilih warna dan tekan putar untuk bermain
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

        <!-- right: info / odds -->
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
              Kenapa peluang 50% tetap merugikan?
            </summary>
            <div class="mt-2 text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>
                Peluang menang memang 50%, tapi hadiahnya cuma
                <strong class="text-amber-200">1,5×</strong> taruhan, bukan 2×.
                Di situlah rumah mengambil untung.
              </p>
              <p>
                Taruhan 10.000: saat menang Anda untung 5.000, saat kalah Anda
                rugi 10.000. Rata-ratanya
                <strong class="text-rose-300">minus 2.500</strong> tiap putaran,
                yaitu 25% dari taruhan.
              </p>
              <p class="text-rose-300 font-semibold">
                Sesekali menang, tapi jangka panjang pasti rugi.
              </p>
            </div>
          </details>
        </aside>
      </div>
    </div>
  </main>
</template>
