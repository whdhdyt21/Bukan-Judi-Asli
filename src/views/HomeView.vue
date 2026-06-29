<script>
import GameCard from "../components/GameCard.vue";
import { RouterLink } from "vue-router";

export default {
  components: {
    GameCard,
    RouterLink,
  },
  props: ["games"],
  methods: {
    scrollToGames() {
      const el = document.getElementById("games");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  },
};
</script>

<template>
  <main
    class="flex flex-col gap-8 w-full min-h-screen items-center justify-start pb-12"
  >
    <!-- "Promo" ticker — the running-text pattern of gambling sites, repurposed for warnings -->
    <div
      class="w-full marquee bg-rose-500/10 border-y border-rose-500/20 py-1.5 text-xs font-semibold text-rose-200"
    >
      <span>
        ⚠️ SIMULASI EDUKASI, TIDAK ADA UANG NYATA &nbsp;•&nbsp; Rumah selalu
        menang dalam jangka panjang &nbsp;•&nbsp; Setiap putaran punya nilai
        harapan negatif &nbsp;•&nbsp; Judi bukan sumber penghasilan
        &nbsp;•&nbsp; Butuh bantuan? Hubungi 119 ext. 8 &nbsp;•&nbsp; Kenali
        polanya, jangan jadi korban
      </span>
    </div>

    <!-- Hero -->
    <section class="w-11/12 sm:w-3/4 lg:w-2/3 glass p-6 sm:p-8">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="flex-1 text-center md:text-left">
          <span
            class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/10 text-amber-200 border border-amber-400/25"
          >
            <span
              class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"
            ></span>
            Platform Edukasi
          </span>
          <h1
            class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight jackpot-text leading-none"
          >
            Sadar Judi
          </h1>
          <p class="mt-3 text-base font-semibold text-slate-100">
            Kenali matematika & risiko perjudian lewat simulasi.
          </p>
          <p class="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">
            Coba simulasinya, lalu lihat sendiri
            <strong class="text-amber-200">mengapa "rumah" selalu menang</strong
            >. Tidak ada uang, taruhan, atau hadiah nyata, hanya pelajaran yang
            bisa menyelamatkan dompet (dan hidup) Anda.
          </p>
          <div
            class="mt-4 flex flex-wrap items-center gap-3 justify-center md:justify-start"
          >
            <RouterLink
              to="/edukasi"
              class="btn btn-primary pulse-glow px-6 py-2.5 rounded-xl"
              >Pelajari Risiko</RouterLink
            >
            <button
              class="btn btn-outline border-amber-400/40 text-amber-100 hover:bg-amber-400/10 px-5 py-2.5 rounded-xl"
              @click="scrollToGames"
            >
              Coba Simulasi
            </button>
          </div>
          <p class="mt-5 text-xs text-slate-400">
            Dibuat oleh
            <a
              class="text-amber-300 hover:underline"
              href="https://github.com/whdhdyt21"
              >Wahid Hidayat</a
            >
          </p>
        </div>

        <!-- decorative balance card -->
        <div class="w-full md:w-60 flex-shrink-0">
          <div
            class="relative rounded-2xl p-5 bg-gradient-to-b from-[#141a2e] to-[#0a0e1a] shadow-2xl border border-amber-400/20 overflow-hidden"
          >
            <div
              class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl"
            ></div>
            <div class="flex items-center justify-between mb-4 relative">
              <div class="text-xs uppercase tracking-wider text-slate-400">
                Saldo Demo
              </div>
              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30"
                >DEMO</span
              >
            </div>
            <div class="text-2xl font-black jackpot-text relative">
              1.000.000
            </div>
            <div class="flex items-center justify-center h-16 mt-2 relative">
              <div class="space-x-[-10px]">
                <div
                  class="inline-block w-14 h-9 rounded-md shadow-lg transform rotate-[-8deg] bg-gradient-to-br from-yellow-300 to-amber-500"
                ></div>
                <div
                  class="inline-block w-14 h-9 rounded-md shadow-lg transform rotate-[6deg] bg-gradient-to-br from-fuchsia-400 to-fuchsia-600"
                ></div>
                <div
                  class="inline-block w-14 h-9 rounded-md shadow-lg transform rotate-[-3deg] bg-gradient-to-br from-sky-400 to-sky-600"
                ></div>
              </div>
            </div>
            <div class="mt-3 text-[11px] text-slate-400 relative">
              Poin palsu, tidak bisa ditarik atau diuangkan.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- "Why does this look like a gambling site?" — turning the aesthetic into the lesson -->
    <section class="w-11/12 sm:w-3/4 lg:w-2/3 glass p-6 border-amber-400/20">
      <div class="flex items-start gap-4">
        <div class="text-3xl">🎰</div>
        <div>
          <h3 class="text-lg font-bold text-amber-100">
            Kenapa tampilannya seperti situs judi?
          </h3>
          <p class="mt-1 text-sm text-slate-300 leading-relaxed">
            Karena memang disengaja. Warna emas berkilau, tombol berdenyut,
            "menang besar", dan running text adalah
            <strong class="text-amber-200">trik psikologis nyata</strong> yang
            dipakai situs judi untuk membuat Anda terus bermain. Di sini Anda
            belajar mengenali pola itu, supaya tidak terjebak saat menemuinya di
            luar sana.
          </p>
        </div>
      </div>
    </section>

    <!-- Games grid -->
    <section id="games" class="w-11/12 sm:w-10/12">
      <div class="flex items-end justify-between mb-5">
        <h2 class="text-xl sm:text-2xl text-white font-extrabold">
          Coba <span class="jackpot-text">Simulasi</span>
        </h2>
        <div class="text-sm text-slate-400">
          Setiap kartu menampilkan house edge-nya
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <GameCard v-for="game in games" :key="game.name" :game="game" />
      </div>
    </section>

    <!-- Disclaimer / footer note -->
    <section
      id="disclaimer"
      class="w-11/12 sm:w-3/4 lg:w-2/3 text-center text-xs text-slate-500"
    >
      <p>
        Ini adalah simulasi edukasi untuk memahami risiko perjudian online.
        Selalu bertanggung jawab dan prioritaskan keselamatan digital. Jika Anda
        atau orang terdekat kesulitan berhenti berjudi, hubungi
        <strong class="text-slate-300">119 ext. 8</strong>.
      </p>
    </section>
  </main>
</template>
