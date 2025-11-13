<script>
import GameCard from "../components/GameCard.vue";

export default {
  components: {
    GameCard,
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
  <main class="flex flex-col gap-12 w-screen min-h-screen items-center justify-start py-12 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
    <!-- Hero -->
    <section class="w-11/12 sm:w-3/4 lg:w-2/3 bg-gradient-to-r from-[#0f172a]/40 via-[#2b0b3a]/30 to-[#0b1222]/40 rounded-3xl p-8 shadow-2xl backdrop-blur-md border border-white/5">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-white drop-shadow-lg neon">
            Selamat Datang di
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 ml-2">
              Demo Kasino Edukatif
            </span>
          </h1>
          <p class="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed max-w-3xl">
            Website ini dibuat untuk <strong>tujuan edukasi</strong> semata. Bukan situs judi sungguhan — tidak ada uang, taruhan, atau hadiah yang terlibat.
            Pelajari mekanika permainan dan risiko yang terlibat dalam pengalaman kasino online.
          </p>
          <div class="mt-4 flex items-center gap-3 justify-center md:justify-start">
            <button class="btn btn-primary glow px-5 py-2" @click="scrollToGames">Mainkan Sekarang</button>
            <a href="#" class="btn btn-outline px-4 py-2">Pelajari Risiko</a>
          </div>

          <p class="mt-4 text-xs text-slate-300">Pembuat: <a class="text-accent underline" href="https://github.com/whdhdyt21">Wahid Hidayat</a></p>
        </div>

        <div class="w-full md:w-72 flex-shrink-0">
          <div class="relative bg-gradient-to-b from-[#111827] to-[#0b1222] rounded-xl p-4 shadow-2xl border border-white/6">
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm text-slate-300">Saldo Demo</div>
              <div class="text-sm text-emerald-400 font-semibold">1,000,000</div>
            </div>
            <div class="flex items-center justify-center h-20">
              <!-- decorative chip stack -->
              <div class="space-x-[-8px]">
                <div class="inline-block w-12 h-8 bg-amber-400 rounded-md shadow-md transform rotate-[-8deg]"></div>
                <div class="inline-block w-12 h-8 bg-fuchsia-500 rounded-md shadow-md transform rotate-[6deg]"></div>
                <div class="inline-block w-12 h-8 bg-sky-500 rounded-md shadow-md transform rotate-[-3deg]"></div>
              </div>
            </div>
            <div class="mt-3 text-xs text-slate-400">Mode: Simulasi edukasi — tidak ada uang nyata.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Games grid -->
    <section id="games" class="w-11/12 sm:w-10/12 lg:w-10/12">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl sm:text-3xl text-white font-bold">Permainan</h2>
        <div class="text-sm text-slate-300">Pilih permainan untuk mencoba simulasi</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="game in games" :key="game.name" class="transform hover:scale-105 transition shadow-md hover:shadow-2xl">
          <GameCard :game="game" />
        </div>
      </div>
    </section>

    <!-- Disclaimer / footer note -->
    <section id="disclaimer" class="w-11/12 sm:w-3/4 lg:w-2/3 mt-8 text-center text-xs text-slate-400">
      <p>
        Catatan: Ini adalah simulasi edukasi. Tujuan utama adalah pembelajaran dan pemahaman risiko dalam perjudian online — selalu bertanggung jawab dan prioritaskan keselamatan digital.
      </p>
    </section>
  </main>
</template>

<style scoped>
/* Slight emphasis for the hero CTA */
.neon { text-shadow: 0 0 8px rgba(255,160,50,0.12); }
.btn-primary.glow { box-shadow: 0 8px 24px rgba(249, 115, 22, 0.12); }
</style>
