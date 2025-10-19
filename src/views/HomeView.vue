<script>
import GameCard from "../components/GameCard.vue";

export default {
  components: {
    GameCard,
  },
  props: ["games"],
};
</script>

<template>
  <main
    class="flex flex-col gap-14 w-screen min-h-screen items-center justify-center"
  >
    <div class="hero w-5/6 sm:w-1/2 rounded-3xl bg-neutral">
      <div class="hero-content !w-full text-center text-neutral-content">
        <div class="m-2">
          <h1 class="mb-5 text-5xl font-bold">
            Selamat Datang di <span class="text-primary">Wahid 98!</span>
          </h1>
          <p>
  Website ini dibuat untuk <strong>tujuan edukasi</strong> semata. 
  Bukan situs judi sungguhan — tidak ada uang, taruhan, atau hadiah yang terlibat. 
  Tujuan proyek ini adalah membantu masyarakat <strong>memahami cara kerja sistem judi online</strong> 
  dan mengapa pemain selalu kalah dalam jangka panjang. 
  Melalui simulasi ini, pengguna dapat merasakan langsung bagaimana algoritma dan peluang 
  dirancang agar sistem selalu menang, serta belajar pentingnya 
  <strong>kesadaran digital dan pengendalian diri</strong> dalam menghadapi dunia daring.
</p>
<p class="mt-3">
  Pembuat:
  <a class="text-accent" href="https://github.com/whdhdyt21"
    >Wahid Hidayat</a
  >
</p>
        </div>
      </div>
    </div>
    <div
      class="w-full flex flex-wrap items-center sm:justify-center flex-col sm:flex-row gap-10"
    >
      <GameCard v-for="game in games" :key="game.name" :game="game" />
    </div>
  </main>
</template>
