<script>
export default {
  props: {
    // Each element: { title, value (peluang %), payout, note }
    elements: { type: Array, required: true },
  },
};
</script>

<template>
  <section class="w-full">
    <header class="flex items-baseline justify-between mb-3">
      <h3 class="text-lg font-bold text-amber-100 neon">
        Peluang &amp; Hadiah
      </h3>
      <span class="text-[11px] text-slate-400">per putaran</span>
    </header>

    <ul class="space-y-2">
      <li
        v-for="(el, idx) in elements"
        :key="idx"
        class="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
      >
        <!-- outcome -->
        <div
          class="font-black text-amber-200 text-sm shrink-0 text-center tracking-wide min-w-[3rem] max-w-[5rem] leading-tight"
        >
          {{ el.title }}
        </div>

        <!-- reward + meaning -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-white truncate">
            {{ el.payout }}
          </div>
          <div v-if="el.note" class="text-[11px] text-slate-400 truncate">
            {{ el.note }}
          </div>
        </div>

        <!-- probability -->
        <div class="text-right shrink-0">
          <div class="text-[10px] uppercase tracking-wide text-slate-500">
            Peluang
          </div>
          <div class="font-mono font-semibold text-rose-300">
            {{ el.value }}
          </div>
        </div>
      </li>
    </ul>

    <p class="mt-2 text-[11px] text-slate-500 leading-snug">
      Hadiah besar selalu berpasangan dengan peluang yang sangat kecil. Itulah
      cara rumah menjaga keuntungan.
    </p>
  </section>
</template>
