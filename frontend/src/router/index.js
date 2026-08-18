import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "../layouts/AppLayout.vue";
import DashboardView from "../views/DashboardView.vue";
import LoginView from "../views/LoginView.vue";
import SachFormView from "../views/SachFormView.vue";
import SachListView from "../views/SachListView.vue";
import DocGiaFormView from "../views/DocGiaFormView.vue";
import DocGiaListView from "../views/DocGiaListView.vue";
import TheoDoiMuonSachListView from "../views/TheoDoiMuonSachListView.vue";
import PhieuMuonFormView from "../views/PhieuMuonFormView.vue";
import NhaXuatBanListView from "../views/NhaXuatBanListView.vue";
import NhaXuatBanFormView from "../views/NhaXuatBanFormView.vue";
import NhanVienListView from "../views/NhanVienListView.vue";
import NhanVienFormView from "../views/NhanVienFormView.vue";
import ChangePasswordView from "../views/ChangePasswordView.vue";
import { getToken, getCurrentUser } from "../services/auth.service.js";

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
				{
					path: "doc-gia",
					name: "doc-gia-list",
					component: DocGiaListView,
				},
				{
					path: "doc-gia/them",
					name: "doc-gia-create",
					component: DocGiaFormView,
				},
				{
					path: "doc-gia/:maDocGia/sua",
					name: "doc-gia-edit",
					component: DocGiaFormView,
				},
				{
					path: "theo-doi-muon-sach",
					name: "theo-doi-muon-sach-list",
					component: TheoDoiMuonSachListView,
				},
				{
					path: "theo-doi-muon-sach/them",
					name: "phieu-muon-create",
					component: PhieuMuonFormView,
				},
				{
					path: "nha-xuat-ban",
					name: "nha-xuat-ban-list",
					component: NhaXuatBanListView,
				},
				{
					path: "nha-xuat-ban/them",
					name: "nha-xuat-ban-create",
					component: NhaXuatBanFormView,
				},
				{
					path: "nha-xuat-ban/:maNXB/sua",
					name: "nha-xuat-ban-edit",
					component: NhaXuatBanFormView,
				},
				{
					path: "nhan-vien",
					name: "nhan-vien-list",
					component: NhanVienListView,
					meta: {
						requiresRole: "Quản lý thư viện",
					},
				},
				{
					path: "nhan-vien/them",
					name: "nhan-vien-create",
					component: NhanVienFormView,
					meta: {
						requiresRole: "Quản lý thư viện",
					},
				},
				{
					path: "nhan-vien/:msnv/sua",
					name: "nhan-vien-edit",
					component: NhanVienFormView,
					meta: {
						requiresRole: "Quản lý thư viện",
					},
				},
				{
					path: "doi-mat-khau",
					name: "change-password",
					component: ChangePasswordView,
				},
			],
		},
	],
});

router.beforeEach((to) => {
	const token = getToken();
	const currentUser = getCurrentUser();

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

	if (to.meta.requiresRole && currentUser?.ChucVu !== to.meta.requiresRole) {
		return {
			name: "dashboard",
		};
	}
});

export default router;
