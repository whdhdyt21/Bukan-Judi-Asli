<script>
export default {
  props: {
    elements: { type: Array, required: true },
    compact: { type: Boolean, default: true },
  },
};
</script>

<template>
  <div tabindex="0" class="collapse rounded-box w-full">
    <div class="collapse-title text-xl font-semibold text-center p-3 neon">Peluang & Hadiah</div>

    <div class="collapse-content">
      <div class="glass p-2 rounded-md shadow max-w-full lg:max-w-md">
        <!-- constrain height on large layouts to keep the right column proportional -->
        <div class="max-h-72 lg:max-h-96 overflow-y-auto pr-2">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="(element, idx) in elements" :key="idx" class="bg-gradient-to-br from-slate-800/40 to-slate-900/30 p-2 rounded-md min-h-0">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-primary">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline justify-between">
                    <div class="text-xs text-slate-300 truncate">{{ element.title }}</div>
                    <div class="text-sm font-semibold text-white ml-2">{{ element.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
