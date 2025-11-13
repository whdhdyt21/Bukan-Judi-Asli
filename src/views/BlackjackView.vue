<script>
import BetSelectButton from "../components/BetSelectButton.vue";
import BlackjackCardTable from "../components/BlackjackCardTable.vue";
import ToastNotification from "../components/ToastNotification.vue";

export default {
  props: ["points"],
  data() {
    return {
      playing: false,
      selectedBet: 25000,
      // reactive selectedBet used for EV display
      lastReward: 0,
      blackjackBets: [25000, 50000, 100000, 250000],
      deckCards: [
        "♠ 10",
        "♥ 10",
        "♦ 10",
        "♣ 10",
        "♠ 2",
        "♥ 2",
        "♦ 2",
        "♣ 2",
        "♠ 3",
        "♥ 3",
        "♦ 3",
        "♣ 3",
        "♠ 4",
        "♥ 4",
        "♦ 4",
        "♣ 4",
        "♠ 5",
        "♥ 5",
        "♦ 5",
        "♣ 5",
        "♠ 6",
        "♥ 6",
        "♦ 6",
        "♣ 6",
        "♠ 7",
        "♥ 7",
        "♦ 7",
        "♣ 7",
        "♠ 8",
        "♥ 8",
        "♦ 8",
        "♣ 8",
        "♠ 9",
        "♥ 9",
        "♦ 9",
        "♣ 9",
        "♠ A",
        "♥ A",
        "♦ A",
        "♣ A",
        "♠ J",
        "♥ J",
        "♦ J",
        "♣ J",
        "♠ Q",
        "♥ Q",
        "♦ Q",
        "♣ Q",
        "♠ K",
        "♥ K",
        "♦ K",
        "♣ K",
      ],
      dealerCards: [],
      playerCards: [],
      discardedCards: [],
      dealerHide: true,
      playerHandValue: 0,
      cardsInPlay: [],
      enableButtons: false,
      dealerHandValue: -1,
      continueButtonEnabled: false,
      action: false,
      shuffle: false,
      // UI: rules section toggle + dynamic rules list
      showRules: false,
      rules: [
        "Pilih jumlah taruhan Anda menggunakan menu pemilih taruhan.",
        "Tekan tombol \"Main\" untuk memulai ronde. Anda dan bandar akan menerima dua kartu masing-masing.",
        "Nilai kartu dihitung sebagai berikut: Kartu bernomor sesuai nilainya, kartu wajah (J, Q, K) bernilai 10, dan As (A) bernilai 1 atau 11 tergantung kebutuhan tangan Anda.",
        "Jika total nilai tangan Anda melebihi 21, Anda \"bust\" dan kalah ronde tersebut.",
        "Gunakan tombol \"Ambil\" untuk meminta kartu tambahan atau \"Tahan\" untuk mengakhiri giliran Anda.",
        "Setelah Anda memilih \"Tahan\", bandar akan mengungkapkan kartunya dan menarik kartu tambahan hingga mencapai nilai minimal 17.",
        "Jika tangan Anda memiliki nilai lebih tinggi dari bandar tanpa melebihi 21, Anda menang dan menerima hadiah sesuai taruhan Anda.",
        "Jika tangan bandar lebih tinggi atau Anda bust, Anda kalah taruhan Anda.",
        "Setelah ronde selesai, gunakan tombol \"Ronde Berikutnya\" untuk memulai ronde baru dengan taruhan yang sama.",
      ],
    };
  },
  components: {
    ToastNotification,
    BetSelectButton,
    BlackjackCardTable,
  },
  computed: {
    evInfo() {
      // Simple EV estimate for this simulation (even-money payout, 1:1)
      // Typical approximate probabilities for single-deck play (indicative):
      const winProb = 0.43; // typical chance to win a hand
      const pushProb = 0.09; // chance of push/tie
      const lossProb = 1 - winProb - pushProb;
      const payout = 1; // current simulation pays even-money for wins
      const evMultiplier = winProb * payout + pushProb * 0 - lossProb * 1; // net fraction of bet
      const placed = Number(this.selectedBet || this.selectedBet === 0 ? this.selectedBet : this.selectedBet);
      const evAmount = Math.round(evMultiplier * placed);
      return { amount: evAmount, percent: evMultiplier * 100 };
    },
  },
  methods: {
    onBetChange(val) {
      this.selectedBet = Number(val);
    },
    startGame() {
      this.selectedBet = Number(this.$refs.betSelect.$data.value);
      if (this.points - this.selectedBet < 0) return;
      this.enableButtons = true;

      this.$emit("changePoints", -this.selectedBet);
      this.playing = true;

      this.giveDealerCards();
      this.givePlayerCards();
    },
    hit() {
      if (this.playerHandValue > 20) return;

      this.playerCards.push(this.fetchCard());

      this.playerHandValue = this.calculateHandValue(this.playerCards);
    },
    stand() {
      this.dealerHide = false;
      while (this.calculateHandValue(this.dealerCards) < 17) {
        this.dealerCards.push(this.fetchCard());
      }
      const dealerHandValue = this.calculateHandValue(this.dealerCards);
      this.dealerHandValue = dealerHandValue;

      // payout logic: start with returning the original bet (so tie returns bet)
      let lastReward = this.selectedBet;
      if (this.playerHandValue > 21 && dealerHandValue > 21) {
        // both busted — tie-ish, keep original bet returned
      } else if (this.playerHandValue > 21) {
        lastReward -= this.selectedBet;
      } else if (dealerHandValue > 21) {
        lastReward += this.selectedBet;
      } else if (this.playerHandValue > dealerHandValue) {
        lastReward += this.selectedBet;
      } else if (dealerHandValue > this.playerHandValue) {
        lastReward -= this.selectedBet;
      }

      this.action = true;
      this.$emit("changePoints", lastReward);
      this.lastReward = lastReward;

      this.enableButtons = false;
      this.continueButtonEnabled = true;
      setTimeout(() => {
        if (!this.shuffle) this.action = false;
      }, 1000);
    },
    startNewRound() {
      if (this.points - this.selectedBet < 0) return;

      this.$emit("changePoints", -this.selectedBet);

      this.continueButtonEnabled = false;
      this.dealerHandValue = -1;
      this.clearBothHands();
      this.discardedCards = this.discardedCards.concat(this.cardsInPlay);
      this.cardsInPlay = [];
      this.giveDealerCards();
      this.givePlayerCards();
      this.enableButtons = true;
    },
    calculateHandValue(arr) {
      let aceCount = 0;
      let value = 0;
      for (let i = 0; i < arr.length; i++) {
        const cardValue = arr[i].slice(2, 4);

        if (cardValue === "A") aceCount++;
        else if (!isNaN(cardValue)) value += Number(cardValue);
        else value += 10;
      }

      value += aceCount;
      if (value <= 11 && aceCount > 0) value += 10;
      return value;
    },
    givePlayerCards() {
      this.playerCards.push(this.fetchCard());
      this.playerCards.push(this.fetchCard());

      this.playerHandValue = this.calculateHandValue(this.playerCards);
    },
    giveDealerCards() {
      this.dealerHide = true;
      this.dealerCards.push(this.fetchCard());
      this.dealerCards.push(this.fetchCard());
    },
    clearBothHands() {
      this.playerCards = [];
      this.dealerCards = [];
      this.playerHandValue = 0;
    },
    fetchCard() {
      if (this.deckCards.length === 0) {
        this.shuffleDiscardToDeck();
      }

      let selectedCard = this.deckCards.splice(
        Math.floor(Math.random() * this.deckCards.length),
        1
      )[0];

      this.cardsInPlay.push(selectedCard);
      return selectedCard;
    },
    shuffleDiscardToDeck() {
      this.deckCards = this.discardedCards;
      this.discardedCards = [];
      this.shuffle = true;
      this.action = true;
      for (let i = this.deckCards.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = this.deckCards[i];
        this.deckCards[i] = this.deckCards[r];
        this.deckCards[r] = tmp;
      }
      setTimeout(() => {
        this.shuffle = false;
        this.action = false;
      }, 3000);
    },
  },
};
</script>

<template>
  <main class="flex flex-col min-h-screen sm:h-screen w-screen justify-start items-center transition-all py-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
    <ToastNotification
      :shuffle="shuffle"
      :message="'Anda memperoleh ' + lastReward + ' poin!'"
      class="transition-all"
      :class="action ? 'translate-x-0' : 'translate-x-96'"
    />

    <section class="w-11/12 sm:w-4/5 lg:w-3/4">
      <header class="w-full flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-extrabold neon">Blackjack</h1>
          <p class="text-sm text-rose-300">Simulasi edukasi — bukan untuk uang nyata. Perjudian dapat merugikan.</p>
        </div>
        <div class="glass px-4 py-2 rounded-md text-sm">
          <div class="text-xs text-slate-300">Saldo</div>
          <div class="font-bold text-lg">{{ points.toLocaleString() }}</div>
        </div>
      </header>
      <!-- Back button removed; navigation is provided by the global NavBar -->

      <div class="flex flex-col sm:flex-row gap-6">
        <!-- controls -->
        <aside class="sm:w-1/3 glass p-4 rounded-xl card-hover">
          <div class="flex flex-col items-center">
            <div class="text-sm text-slate-300">Taruhan Terpilih</div>
            <p class="text-2xl font-bold mt-1">{{ selectedBet.toLocaleString() }}</p>
          </div>

          <div class="mt-4 flex flex-col gap-3">
            <BetSelectButton
              :class="playing ? 'select-disabled' : 'select-active'"
              :bets="blackjackBets"
              id="betSelect"
              ref="betSelect"
              @change="onBetChange"
              :disabled="playing"
            />

            <button
              class="btn btn-primary glow w-full flex items-center justify-center gap-2"
              @click="startGame"
              ref="spinButton"
              :disabled="playing || points - selectedBet < 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 10a7 7 0 1114 0A7 7 0 013 10zm6-3v6l5-3-5-3z" />
              </svg>
              <span>Main</span>
            </button>

            <div class="flex items-center justify-center gap-3 mt-2">
              <div v-if="enableButtons" class="btn-group">
                <button class="btn flex items-center gap-2" @click="hit" :disabled="!enableButtons">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20l9-5-9-5-9 5 9 5z"/>
                  </svg>
                  Ambil
                </button>
                <button class="btn flex items-center gap-2" @click="stand" :disabled="!enableButtons">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Tahan
                </button>
              </div>
            </div>

            <button
              v-if="continueButtonEnabled"
              class="btn btn-secondary w-full mt-3"
              @click="startNewRound"
              :disabled="points - selectedBet < 0"
            >
              Ronde Berikutnya
            </button>
          </div>

          <div class="mt-4 text-xs text-slate-400">
            <div class="mb-2">
              <div class="text-xs text-slate-300">Ekspektasi (EV) rata‑rata</div>
              <div class="text-lg font-bold">{{ evInfo.amount.toLocaleString() }} <span class="text-xs text-slate-400">({{ evInfo.percent.toFixed(1) }}%)</span></div>
              <div class="text-xs text-slate-400">Berbasis taruhan saat ini: <strong>{{ selectedBet.toLocaleString() }}</strong></div>
            </div>
            Hadiah terakhir: <span class="font-mono">{{ lastReward }}</span>
          </div>
        </aside>

        <!-- game area -->
        <div class="flex-1 flex flex-col items-center gap-4">
          <div class="w-full glass p-4 rounded-xl flex flex-col items-center card-hover">
            <div class="w-full flex items-center justify-between mb-3">
              <div class="text-sm text-slate-300">Bandar</div>
              <div class="text-lg font-bold text-white">{{ dealerHandValue < 0 ? "?" : dealerHandValue }}</div>
            </div>

            <BlackjackCardTable
              :dealerHide="dealerHide"
              :cards="dealerCards"
              class="fade-in"
            ></BlackjackCardTable>
          </div>

          <div class="w-full flex items-center justify-center">
            <div class="divider"></div>
          </div>

          <div class="w-full glass p-4 rounded-xl card-hover">
            <div class="w-full flex items-center justify-between mb-3">
              <div class="text-sm text-slate-300">Pemain</div>
              <div class="text-lg font-bold text-white">{{ playerHandValue }}</div>
            </div>
            <BlackjackCardTable
              :dealerHide="false"
              :cards="playerCards"
              class="fade-in"
            ></BlackjackCardTable>
          </div>
        </div>
      </div>

      <!-- cara bermain (modern dropdown using details) -->
      <section class="mt-8">
        <details class="relative glass p-4 rounded-xl" :open="showRules">
          <summary class="flex items-center justify-between cursor-pointer list-none">
            <h3 class="text-xl font-bold m-0">Cara Bermain Blackjack</h3>
            <span class="ml-3 text-sm text-slate-300 summary-chev">&#9662;</span>
          </summary>

          <div class="mt-3">
            <ol class="list-decimal list-inside space-y-2 text-slate-200 text-sm">
              <li v-for="(r, i) in rules" :key="i">{{ r }}</li>
            </ol>
          </div>
        </details>
        <!-- peluang & hadiah (dropdown informatif dengan peringatan) -->
        <details class="relative glass p-4 rounded-xl mt-4">
          <summary class="flex items-center justify-between cursor-pointer list-none">
            <h3 class="text-xl font-bold m-0">Peluang & Hadiah</h3>
            <span class="ml-3 text-sm text-slate-300 summary-chev">&#9662;</span>
          </summary>

          <div class="mt-3 text-sm text-slate-200 space-y-3">
            <p class="font-semibold text-rose-300">Peringatan: Bermain dengan taruhan berulang cenderung mengarah pada kerugian bersih.</p>

            <p>
              Kasino memiliki keunggulan matematis (house edge) pada permainan seperti Blackjack. Artinya, dalam jangka panjang pemain rata‑rata akan kehilangan sebagian kecil dari total taruhannya. Informasi berikut bersifat edukatif dan bukan jaminan hasil.
            </p>

            <ul class="list-disc list-inside">
              <li><strong>Blackjack natural (A + kartu bernilai 10):</strong> relatif jarang; kasino biasanya membayar 3:2 untuk natural, namun simulasi ini saat ini menggunakan pembayaran 1:1 kecuali Anda ingin saya ubah.</li>
              <li><strong>Peluang menang/seri/kalah:</strong> bergantung aturan dan strategi; angka tipikal berkisar pada kemenangan 40–49%, push ~8–9%, sisanya kalah.</li>
            </ul>

            <div class="bg-slate-800 p-3 rounded text-slate-300">
              <div class="font-semibold">Contoh dampak house edge</div>
              <div class="text-xs mt-1">Misal Anda bertaruh <strong>25.000</strong> sekali:</div>
              <ul class="list-inside list-decimal ml-4 text-xs mt-2">
                <li>Jika house edge ≈ <strong>1%</strong>, ekspektasi kerugian rata‑rata per taruhan ≈ <strong>250</strong> (1% dari 25.000).</li>
                <li>Dengan bertaruh berulang, jumlah kerugian rata‑rata akan meningkat seiring jumlah ronde.</li>
              </ul>
            </div>

            <p class="text-xs text-slate-400">
              Kesimpulan: Bermain hanya untuk hiburan. Jangan bertaruh lebih dari yang Anda mampu untuk kehilangan. Jika Anda atau seseorang yang Anda kenal mengalami masalah terkait judi, cari bantuan profesional.
            </p>
          </div>
        </details>
      </section>
    </section>
  </main>
</template>

<style scoped>
details[open] .summary-chev {
  transform: rotate(180deg);
}
summary::-webkit-details-marker {
  display: none;
}
summary {
  padding: 0.25rem 0.5rem;
}

/* back button styling */
.back-btn {
  background: linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.04);
  color: #fff;
}
.back-btn:hover {
  background: rgba(255,255,255,0.03);
}

</style>
