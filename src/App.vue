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

// Session statistics — the core educational signal: how much has been
// wagered vs. how much has actually been won/lost over the session.
const totalWagered = ref(Number(localStorage.getItem("totalWagered") || 0));
const netResult = ref(Number(localStorage.getItem("netResult") || 0));

// keep localStorage in sync whenever points change
watch(points, (val) => {
  localStorage.setItem("points", String(val));
});
watch(totalWagered, (val) => localStorage.setItem("totalWagered", String(val)));
watch(netResult, (val) => localStorage.setItem("netResult", String(val)));

function changePoints(delta) {
  const amount = Number(delta);
  // allow positive or negative changes
  points.value = Number(points.value) + amount;
  // a negative delta is a bet being placed; a positive delta is a payout
  if (amount < 0) totalWagered.value += -amount;
  netResult.value += amount;
}

function resetSession() {
  points.value = 1000000;
  totalWagered.value = 0;
  netResult.value = 0;
}

// Games listing (kept in English as requested)
const base = import.meta.env.BASE_URL || "/";
const games = [
  new Game(
    "Slots",
    base + "slots.svg",
    "Lihat bagaimana peluang kecil & pembayaran dipasang agar pemain rugi."
  ),
  new Game(
    "Roulette",
    base + "roulette.svg",
    "Pahami kenapa taruhan warna 50/50 tetap merugikan dalam jangka panjang."
  ),
  new Game(
    "Blackjack",
    base + "blackjack.svg",
    "Pelajari house edge meski permainan terasa berbasis keterampilan."
  ),
];
</script>

<template>
  <NavBar
    :points="points"
    :totalWagered="totalWagered"
    :netResult="netResult"
    @resetSession="resetSession"
  />
  <RouterView
    class="pb-10 pt-28 sm:pt-24"
    :games="games"
    @changePoints="changePoints"
    :points="points"
  />
</template>
