<script>
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  data() {
    return {
      // House edge per game (sinkron dengan implementasi di tiap view)
      games: [
        { name: "Slots", rtp: 92, edge: 8 },
        { name: "Roulette", rtp: 75, edge: 25 },
        { name: "Blackjack", rtp: 95, edge: 5 },
      ],
      // Simulator "main 1 juta sampai habis"
      simBet: 10000,
      simEdge: 8,
      simStart: 1000000,
    };
  },
  computed: {
    // Berapa kali rata-rata bisa bertaruh sebelum saldo habis,
    // dan total kerugian harapan. Ilustrasi sederhana house edge.
    simSpinsUntilBroke() {
      // setiap putaran rata-rata kehilangan edge% dari taruhan
      const lossPerSpin = this.simBet * (this.simEdge / 100);
      if (lossPerSpin <= 0) return Infinity;
      return Math.round(this.simStart / lossPerSpin);
    },
  },
};
</script>

<template>
  <main
    class="flex flex-col items-center w-full min-h-screen py-12 text-slate-200"
  >
    <div class="w-11/12 sm:w-3/4 lg:w-3/5 flex flex-col gap-8">
      <!-- Header -->
      <header class="text-center">
        <h1 class="text-4xl font-extrabold text-white neon">
          Pelajari Risiko Perjudian
        </h1>
        <p class="mt-3 text-slate-300">
          Halaman ini menjelaskan
          <strong>mengapa kasino selalu unggul</strong> secara matematis. Pahami
          konsepnya sekali, dan Anda akan melihat semua game judi dengan cara
          berbeda.
        </p>
      </header>

      <!-- House edge cards -->
      <section class="glass p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-white">
          1. House Edge: Keunggulan Rumah
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          Setiap permainan dirancang agar pembayaran lebih kecil dari peluang
          sebenarnya. Selisih itu disebut <strong>house edge</strong>.
          <strong>RTP</strong> (Return to Player) adalah persentase taruhan yang
          rata-rata dikembalikan ke pemain dalam jangka panjang. Sisanya =
          keuntungan rumah.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div
            v-for="g in games"
            :key="g.name"
            class="bg-white/5 p-4 rounded-xl"
          >
            <div class="text-lg font-bold text-white">{{ g.name }}</div>
            <div class="mt-2 text-sm">
              RTP: <span class="text-emerald-400 font-mono">{{ g.rtp }}%</span>
            </div>
            <div class="text-sm">
              House edge:
              <span class="text-rose-400 font-mono">{{ g.edge }}%</span>
            </div>
            <div
              class="mt-2 h-2 w-full bg-rose-500/20 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-emerald-500/60"
                :style="{ width: g.rtp + '%' }"
              ></div>
            </div>
            <div class="mt-1 text-[11px] text-slate-400">
              Tiap Rp100.000 taruhan, rata-rata hilang Rp{{
                (g.edge * 1000).toLocaleString()
              }}.
            </div>
          </div>
        </div>
      </section>

      <!-- EV explanation -->
      <section class="glass p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-white">
          2. Expected Value (EV): Nilai Harapan
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          EV adalah rata-rata hasil jika Anda bermain berkali-kali. Pada judi,
          EV selalu
          <strong class="text-rose-400">negatif</strong>. Contoh roulette
          merah/hitam:
        </p>
        <div
          class="mt-3 bg-black/30 p-4 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto"
        >
          Taruhan Rp10.000, peluang menang 50%, hadiah 1.5× <br />
          EV = 0,5 × (+Rp5.000) + 0,5 × (−Rp10.000) =
          <span class="text-rose-400">−Rp2.500 per putaran</span><br />
          → rata-rata kehilangan 25% dari setiap taruhan.
        </div>
        <p class="mt-3 text-sm text-slate-300">
          Sesekali menang itu wajar, dan justru itulah yang membuat judi terasa
          menggoda. Tapi
          <strong>jangka panjang selalu merugikan</strong>.
        </p>
      </section>

      <!-- Simulator -->
      <section class="glass p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-white">
          3. Berapa Lama Saldo Bertahan?
        </h2>
        <p class="mt-2 text-sm text-slate-300">
          Ubah angka di bawah untuk melihat perkiraan berapa putaran sebelum
          saldo habis.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
          <label class="flex flex-col gap-1">
            <span class="text-slate-400">Saldo awal</span>
            <input
              type="number"
              v-model.number="simStart"
              class="bg-white/10 rounded-md px-3 py-2 text-white"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-slate-400">Taruhan / putaran</span>
            <input
              type="number"
              v-model.number="simBet"
              class="bg-white/10 rounded-md px-3 py-2 text-white"
            />
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-slate-400">House edge (%)</span>
            <input
              type="number"
              v-model.number="simEdge"
              class="bg-white/10 rounded-md px-3 py-2 text-white"
            />
          </label>
        </div>
        <div
          class="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-center"
        >
          Secara matematis, saldo akan habis setelah sekitar
          <span class="text-2xl font-bold text-rose-300">{{
            simSpinsUntilBroke.toLocaleString()
          }}</span>
          putaran.
          <div class="text-[11px] text-slate-400 mt-1">
            (estimasi rata-rata; keberuntungan jangka pendek bisa membuatnya
            lebih cepat atau lambat)
          </div>
        </div>
      </section>

      <!-- Cognitive traps -->
      <section class="glass p-6 rounded-2xl">
        <h2 class="text-2xl font-bold text-white">4. Jebakan Pikiran</h2>
        <ul class="mt-3 space-y-3 text-sm text-slate-300">
          <li>
            <strong class="text-white">Gambler's Fallacy:</strong> "Sudah kalah
            5 kali, pasti sebentar lagi menang." Salah. Setiap putaran
            independen, peluangnya tidak berubah.
          </li>
          <li>
            <strong class="text-white">Near-miss:</strong> Hampir menang (2 dari
            3 simbol) dirancang untuk memicu dorongan bermain lagi, padahal
            tetap kalah.
          </li>
          <li>
            <strong class="text-white">Chasing losses:</strong> Menambah taruhan
            untuk "balik modal" justru mempercepat kerugian karena house edge
            bekerja pada setiap taruhan.
          </li>
        </ul>
      </section>

      <!-- Help -->
      <section class="glass p-6 rounded-2xl border border-emerald-500/30">
        <h2 class="text-2xl font-bold text-white">5. Butuh Bantuan?</h2>
        <p class="mt-2 text-sm text-slate-300">
          Jika Anda atau orang terdekat kesulitan mengendalikan dorongan
          berjudi, itu bisa diobati dan Anda tidak sendirian.
        </p>
        <ul class="mt-3 space-y-2 text-sm">
          <li>
            📞 <strong>SEJIWA / Kemenkes:</strong> hubungi
            <strong>119 ext. 8</strong> (layanan kesehatan jiwa, gratis).
          </li>
          <li>🏥 Konsultasi ke puskesmas atau psikolog terdekat.</li>
          <li>🤝 Bicarakan dengan keluarga atau teman yang dipercaya.</li>
        </ul>
      </section>

      <div class="text-center">
        <RouterLink to="/" class="btn btn-primary px-6 py-2"
          >Kembali ke Beranda</RouterLink
        >
      </div>

      <p class="text-center text-xs text-slate-500">
        Semua angka di situs ini adalah simulasi. Tidak ada uang nyata, taruhan,
        atau hadiah.
      </p>
    </div>
  </main>
</template>

<style scoped>
.neon {
  text-shadow: 0 0 8px rgba(255, 160, 50, 0.12);
}
</style>
