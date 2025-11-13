<script>
export default {
  props: ["points"],
};
</script>

<template>
  <nav
    class="fixed sm:px-20 py-5 bg-neutral bg-opacity-50 backdrop-blur-xl sm:bg-opacity-0 sm:backdrop-blur-0 w-screen flex flex-col sm:flex-row items-center justify-between z-40"
  >
    <div id="menu" class="flex items-center justify-between sm:w-1/5 gap-3">
      <button @click="$router.push('/')" aria-label="Beranda" title="Beranda" class="home-btn p-1 rounded-md hover:bg-white/5 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5M5 21h14a1 1 0 001-1V10.5" />
        </svg>
      </button>
      <a class="font-semibold text-2xl" href="/Wahid98Gacor/">Wahid 98 GACOR</a>
    </div>
    <div
      id="pointCounter"
      class="flex items-center justify-center gap-2 w-1/12"
    >
      <img
        src="/src/assets/icons/point.svg"
        alt="point"
        class="w-10 white-icon"
      />
      <p id="pointCounterContent" class="text-xl">
        {{ points.toLocaleString("fi-FI") }}
      </p>
    </div>
  </nav>
</template>

<style scoped>
.white-icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(17%)
    hue-rotate(241deg) brightness(105%) contrast(100%);
}

.home-btn {
  color: #fff;
}
</style>
 
