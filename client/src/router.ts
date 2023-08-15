import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import KillsTable from "./components/kills-table.vue";
import Root from "./components/root-route.vue";
import FinalTable from "./components/final-table.vue";
import AddRemoveSquad from "./components/add-remove-squad.vue";

const routes: Array<RouteRecordRaw> = [
	{ path: '/kills-table', name: 'kills-table', component: KillsTable },
	{ path: '/final-table', name: 'finals-table', component: FinalTable },
	{ path: '/add-remove-squad', name: 'add-remove-squad', component: AddRemoveSquad },
	{ path: '/', name: 'root', component: Root },
]

const router = createRouter({
	history: createWebHistory(),
	routes
});

export default router;
