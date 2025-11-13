<script>
export default {
  props: ["cards", "dealerHide"],
};
</script>

<template>
  <div class="flex justify-center gap-4 w-full flex-wrap">
    <div
      v-for="(card, idx) in (dealerHide ? cards.slice(0, 1) : cards)"
      :key="card + '-' + idx"
      class="flex flex-col justify-between bg-neutral text-primary p-3 sm:p-4 rounded-lg font-extrabold text-sm sm:text-base w-24 sm:w-32 md:w-40 min-w-[70px] h-28 sm:h-36 md:h-44 items-center"
    >
      <div class="w-full text-left text-xs sm:text-sm text-slate-300">{{ card.slice(2).trim() }}</div>
      <div
        :class="['text-center', (card[0] === '♦' || card[0] === '♥') ? 'text-red-500' : 'text-black', 'text-2xl sm:text-3xl md:text-4xl']"
      >
        {{ card[0] }}
      </div>
      <div class="w-full text-right text-xs sm:text-sm text-slate-300">{{ card.slice(2).trim() }}</div>
    </div>

    <div v-if="dealerHide" class="flex flex-col justify-between bg-neutral text-primary p-3 sm:p-4 rounded-lg text-sm sm:text-base w-24 sm:w-32 md:w-40 min-w-[70px] h-28 sm:h-36 md:h-44 items-center">
      <div class="w-full text-left text-xs sm:text-sm text-slate-300">?</div>
      <div class="text-center text-2xl sm:text-3xl md:text-4xl">?</div>
      <div class="w-full text-right text-xs sm:text-sm text-slate-300">?</div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped minimal adjustments if needed */
.card-back {
  background-image: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
}
</style>
