<script>
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  props: {
    points: { type: Number, required: true },
    totalWagered: { type: Number, default: 0 },
    netResult: { type: Number, default: 0 },
  },
};
</script>

<template>
  <nav
    class="fixed top-0 left-0 w-full z-40 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#070b16]/80 backdrop-blur-xl border-b border-amber-400/20 shadow-lg shadow-black/40"
  >
    <!-- Brand + nav -->
    <div id="menu" class="flex items-center gap-3">
      <RouterLink to="/" class="flex items-center gap-2 group">
        <img
          src="/favicon.svg"
          alt="Logo Sadar Judi"
          class="w-9 h-9 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
        />
        <span class="font-extrabold text-xl tracking-tight jackpot-text"
          >Sadar Judi</span
        >
      </RouterLink>

      <span
        class="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30"
        title="Ini simulasi edukasi, tidak ada uang nyata"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
        Simulasi
      </span>

      <RouterLink
        to="/edukasi"
        class="ml-1 text-sm font-semibold px-3 py-1.5 rounded-lg bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 border border-amber-400/20 transition"
      >
        Pelajari Risiko
      </RouterLink>
    </div>

    <!-- Session stats + balance -->
    <div class="flex items-center gap-3">
      <!-- Session tracker: empirical proof of the house edge -->
      <div class="hidden lg:flex flex-col items-end leading-tight mr-1">
        <div class="text-[11px] text-slate-400">
          Total dipertaruhkan:
          <span class="font-mono text-slate-200">{{
            totalWagered.toLocaleString()
          }}</span>
        </div>
        <div class="text-[11px]">
          Hasil bersih sesi:
          <span
            class="font-mono font-semibold"
            :class="
              netResult < 0
                ? 'text-rose-400'
                : netResult > 0
                ? 'text-emerald-400'
                : 'text-slate-200'
            "
          >
            {{ netResult > 0 ? "+" : "" }}{{ netResult.toLocaleString() }}
          </span>
        </div>
      </div>

      <!-- Balance as a casino coin chip -->
      <div class="chip" title="Saldo demo (poin)">
        <span
          class="flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-black text-amber-900 bg-gradient-to-br from-yellow-300 to-amber-500 shadow-inner"
          >₽</span
        >
        <span class="text-base font-bold text-amber-100 font-mono">{{
          points.toLocaleString("fi-FI")
        }}</span>
      </div>

      <button
        class="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
        title="Atur ulang saldo & statistik sesi"
        @click="$emit('resetSession')"
      >
        Reset
      </button>
    </div>
  </nav>
</template>
