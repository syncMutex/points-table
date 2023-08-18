import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Root from "./components/root-route.vue";
import KillsTable from "./components/kills-table.vue";
import FinalTable from "./components/final-table.vue";
import KillsTableClient from "./components/kills-table-client.vue";
import FinalTableClient from "./components/final-table-client.vue";
import AddRemoveSquad from "./components/add-remove-squad.vue";
import Standings from "./components/standings.vue";

const routes: Array<RouteRecordRaw> = [
	{ path: '/client/kills-table', name: 'kills-table-client', component: KillsTableClient },
	{ path: '/client/final-table', name: 'finals-table-client', component: FinalTableClient },
	{ path: '/client/standings', name: 'standings', component: Standings },
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
