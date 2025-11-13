<script setup>
import { ref } from "vue";
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
  // Kept in-sync with current view implementations:
  // Slots: n=5 symbols, k=3 reels, payouts used in code: $$$×5, 777×7, 2-same×2
  // Expected reward multiplier = 1.056 -> RTP = 105.6% (player advantage ≈ -5.6% house edge)
  Slots: { rtp: "92.0%", edge: "8.0%" },

  // Roulette: 2 colors, payout 1.5× on win -> RTP = 1.5 * 0.5 = 0.75 -> 75.0% (house edge 25.0%)
  Roulette: { rtp: "75.0%", edge: "25.0%" },

  // Blackjack: current simulation pays 1:1 for wins with approximate win/push probs -> EV ≈ -5% -> RTP ≈ 95%
  Blackjack: { rtp: "95.0%", edge: "5.0%" },
};

// showStats toggles on hover to reveal RTP / house edge subtly
const showStats = ref(false);
const myStats = statsMap[props.game.name] || { rtp: "N/A", edge: "N/A" };
</script>

<template>
  <div
    v-bind="attrs"
    class="relative rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 shadow-2xl border border-white/6 bg-gradient-to-br from-[#071026]/60 via-[#0b1222]/50 to-[#071026]/60"
    @mouseenter="showStats = true"
    @mouseleave="showStats = false"
    role="button"
    aria-label="Open {{ game.name }}"
  >
    <div class="relative h-44 sm:h-52 w-full group">
      <img :src="game.image" :alt="game.name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      <div class="absolute left-3 top-3 flex items-center gap-2">
        <span class="text-xs font-semibold bg-amber-400/95 text-black px-2 py-1 rounded-full">Demo</span>
        <span class="text-xs font-medium bg-white/10 text-white px-2 py-1 rounded-full">Hot</span>
      </div>

      <!-- subtle badge on hover -->
      <div class="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="px-3 py-1 rounded-full bg-black/50 text-xs text-slate-200 border border-white/6">Mode: Demo</div>
      </div>
    </div>

    <div class="p-4 flex flex-col gap-3">
      <div class="flex items-start justify-between">
        <h3 class="text-lg text-white font-extrabold tracking-tight">{{ game.name }}</h3>
        <div v-if="showStats" class="text-xs text-slate-300 text-right">
          <div>{{ myStats.rtp }} RTP</div>
        </div>
      </div>

      <p class="text-sm text-slate-300 line-clamp-3">{{ game.description }}</p>

      <div class="flex items-center justify-between mt-3">
        <div class="flex gap-2 items-center">
          <div v-if="showStats" class="text-[11px] px-2 py-1 bg-white/6 text-slate-200 rounded-md">House edge: {{ myStats.edge }}</div>
          <div class="text-[11px] px-2 py-1 bg-white/6 text-slate-200 rounded-md">Mode: Demo</div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="play" class="btn btn-primary px-4 py-2 rounded-full shadow-md neon-glow">Play</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neon-glow {
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.12), 0 0 18px rgba(249, 115, 22, 0.06) inset;
}

/* small utility: clamp lines for descriptions */
.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>
