import { createRouter, createMemoryHistory } from "vue-router";
import Layout from '../Layout/index.vue';
import ToDo from '../views/ToDo/index.vue';
import LLM from "../views/LLM/index.vue";

const routers = [
  {
    path: "/",
    component: Layout,
    redirect: "/todo",
    children: [
      {
        path: "todo",
        component: ToDo,
        redirect: "/todo/today",
        children: [
          {
            path: "today",
            component: () => import("../views/ToDo/components/today.vue"),
          },
          {
            path: "preview",
            component: () => import("../views/ToDo/components/preview.vue"),
          },
        ],
      },
      {
        path: "searchgrade",
        component: () => import("../views/SearchGrade/index.vue"),
      },
      {
        path: "llm",
        component: LLM,
      },
    ],
  },
];



const router = createRouter({
    history: createMemoryHistory(),
    routes: routers
});

export default router;