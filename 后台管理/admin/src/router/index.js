import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import CampusMarket from "../views/CampusMarket.vue";
import LostFound from "../views/LostFound.vue";
import CampusRunner from "../views/CampusRunner.vue";
import JobPosting from "../views/JobPosting.vue";
import AdminManagement from "../views/AdminManagement.vue";
import UserManagement from "../views/UserManagement.vue";

import DataManagement from "../views/DataManagement.vue";
import auditRunners from "../views/auditRunners.vue";
import MutualAid from "../views/MutualAid.vue";

import Lost from "../views/Lost.vue";
import Found from "../views/Found.vue";
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  /*   {
    path: "/test",
    component: () => import("../test.vue")
  }, */
  {
    path: "/home",
    component: Home,
    children: [
      { path: "campus-market", component: CampusMarket },
      {
        path: "lost-found",
        component: LostFound,
        children: [
          {
            path: "lost",
            component: Lost,
          },
          {
            path: "found",
            component: Found,
          },
        ],
      },
      {
        path: "campus-runner",
        component: CampusRunner,
        children: [
          {
            path: "data-management",
            component: DataManagement,
          },
          {
            path: "audit-runners",
            component: auditRunners,
          },
        ],
      },
      { path: "job-posting", component: JobPosting },
      { path: "mutual-aid", component: MutualAid },
      { path: "user-management", component: UserManagement },
      { path: "admin-management", component: AdminManagement },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
