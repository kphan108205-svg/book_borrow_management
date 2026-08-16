import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import SachFormView from "../views/SachFormView.vue";
import SachListView from "../views/SachListView.vue";
import { getToken } from "../services/auth.service.js";

const router = createRouter({
	history: createWebHistory(),

	routes: [
		{
			path: "/login",
			name: "login",
			component: LoginView,
			meta: {
				guestOnly: true,
			},
		},
		{
			path: "/",
			component: AppLayout,
			meta: {
				requiresAuth: true,
			},
			children: [
				{
					path: "",
					redirect: {
						name: "dashboard",
					},
				},
				{
					path: "dashboard",
					name: "dashboard",
					component: DashboardView,
				},
				{
					path: "sach",
					name: "sach-list",
					component: SachListView,
				},
				{
					path: "sach/them",
					name: "sach-create",
					component: SachFormView,
				},
				{
					path: "sach/:maSach/sua",
					name: "sach-edit",
					component: SachFormView,
				},
			],
		},
	],
});

router.beforeEach((to) => {
	const token = getToken();

	if (to.meta.requiresAuth && !token) {
		return {
			name: "login",
		};
	}

	if (to.meta.guestOnly && token) {
		return {
			name: "dashboard",
		};
	}
});

export default router;
