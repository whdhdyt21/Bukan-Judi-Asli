<script setup>
import { useRouter } from "vue-router";
import { useAttrs } from "vue";

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const attrs = useAttrs();
const router = useRouter();

function play() {
  // navigate to a path based on game name (lowercase)
  const path = `/${props.game.name.toLowerCase()}`;
  router.push(path).catch(() => {});
}

const statsMap = {
  // Sinkron dengan implementasi tiap view. RTP = bagian taruhan yang rata-rata
  // kembali ke pemain; sisanya (house edge) adalah keuntungan rumah.
  // Slots: n=5 simbol, k=3 gulungan, payout $$$×27, 777×28, 2-sama×1 -> RTP ≈ 92%.
  Slots: { rtp: "92.0%", edge: "8.0%" },

  // Roulette: 2 colors, payout 1.5× on win -> RTP = 1.5 * 0.5 = 0.75 -> 75.0% (house edge 25.0%)
  Roulette: { rtp: "75.0%", edge: "25.0%" },

  // Blackjack: current simulation pays 1:1 for wins with approximate win/push probs -> EV ≈ -5% -> RTP ≈ 95%
  Blackjack: { rtp: "95.0%", edge: "5.0%" },
};

const myStats = statsMap[props.game.name] || { rtp: "N/A", edge: "N/A" };
</script>

<template>
  <div
    v-bind="attrs"
    class="relative rounded-2xl overflow-hidden card-hover shadow-2xl border border-amber-400/15 bg-gradient-to-br from-[#101627] via-[#0b1222] to-[#101627] cursor-pointer"
    @click="play"
    role="button"
    aria-label="Open {{ game.name }}"
  >
    <div class="relative h-44 sm:h-52 w-full group">
      <img
        :src="game.image"
        :alt="game.name"
        class="w-full h-full object-contain bg-slate-900"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      ></div>

      <div class="absolute left-3 top-3 flex items-center gap-2">
        <span
          class="text-xs font-semibold bg-amber-400/95 text-black px-2 py-1 rounded-full"
          >Simulasi</span
        >
        <span
          class="text-xs font-medium bg-rose-500/80 text-white px-2 py-1 rounded-full"
          >Edukasi</span
        >
      </div>

      <!-- subtle badge on hover -->
      <div
        class="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div
          class="px-3 py-1 rounded-full bg-black/50 text-xs text-slate-200 border border-white/6"
        >
          Mode: Demo
        </div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-start justify-between">
        <h3 class="text-xl text-white font-extrabold tracking-tight neon">
          {{ game.name }}
        </h3>
        <div class="text-xs text-emerald-300 text-right font-mono">
          {{ myStats.rtp }} RTP
        </div>
      </div>

      <p class="text-sm text-slate-300 line-clamp-3 min-h-[3.5rem]">
        {{ game.description }}
      </p>

      <div class="flex items-center justify-between mt-2">
        <div class="flex gap-2 items-center">
          <div
            class="text-[11px] font-semibold px-2 py-1 bg-rose-500/15 text-rose-200 rounded-md border border-rose-500/20"
            :title="'RTP ' + myStats.rtp"
          >
            House edge: {{ myStats.edge }}
          </div>
        </div>

        <button
          @click.stop="play"
          class="btn btn-primary btn-sm px-5 rounded-full glow"
        >
          Coba
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* small utility: clamp lines for descriptions */
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
