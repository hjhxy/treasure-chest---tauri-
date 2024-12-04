import { createRouter, createMemoryHistory } from "vue-router";
import Layout from '../Layout/index.vue';
import ToDo from '../views/ToDo/index.vue';

const routers = [{
    path: "/",
    component: Layout,
    redirect: '/todo',
    children: [
        {
            path: "todo",
            component: ToDo,
            redirect:'/todo/today',
            children: [
                {
                    path: "today",
                    component: ()=>import('../views/Today/index.vue')
                },
                {
                    path: "preview",
                    component: ()=>import('../views/Preview/index.vue')
                },
            ]
        },
        {
            path: "classSchedule",
            component: ()=>import('../views/ClassSchdule/index.vue')
        },
        {
            path: 'chatgpt',
            component: ()=>import('../views/ChatGPT/index.vue')
        }
    ]
}];



const router = createRouter({
    history: createMemoryHistory(),
    routes: routers
});

export default router;