import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/slots",
      name: "slots",
      component: () => import("../views/SlotsView.vue"),
    },
    {
      path: "/roulette",
      name: "roulette",
      component: () => import("../views/RouletteView.vue"),
    },
    {
      path: "/blackjack",
      name: "blackjack",
      component: () => import("../views/BlackjackView.vue"),
    },
    {
      path: "/edukasi",
      name: "edukasi",
      component: () => import("../views/EducationView.vue"),
    },
  ],
});

export default router;
