<script setup>
import { ref, watch } from "vue";
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import Game from "@/Game";

// initialize default points if missing
if (localStorage.getItem("points") === null) {
  localStorage.setItem("points", String(1000000));
}

const points = ref(Number(localStorage.getItem("points") || 1000000));

// keep localStorage in sync whenever points change
watch(points, (val) => {
  localStorage.setItem("points", String(val));
});

function changePoints(delta) {
  // allow positive or negative changes
  points.value = Number(points.value) + Number(delta);
}

// Games listing (kept in English as requested)
const games = [
  new Game("Slots", "/wahid98gacor/slots.jpg", "Putar slot dan menangkan hadiah!"),
  new Game("Roulette", "/wahid98gacor/roulette.jpg", "Putar roda dan menangkan!"),
  new Game("Blackjack", "/wahid98gacor/blackjack.jpg", "Kalahkan bandar dan menangkan!"),
];
</script>

<template>
  <NavBar :points="points" />
  <RouterView
    class="h-full pb-10 pt-28"
    :games="games"
    @changePoints="changePoints"
    :points="points"
  />
</template>