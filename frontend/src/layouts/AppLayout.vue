<script setup>
import { useRouter } from "vue-router";

import { getCurrentUser, logout } from "../services/auth.service.js";

const router = useRouter();
const currentUser = getCurrentUser();

async function handleLogout() {
	logout();

	await router.push({
		name: "login",
	});
}
</script>

<template>
	<div class="app-layout">
		<header class="bg-dark text-white shadow-sm">
			<div
				class="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3 px-4 py-3"
			>
				<RouterLink
					:to="{ name: 'dashboard' }"
					class="text-white text-decoration-none fw-semibold"
				>
					<i class="fa-solid fa-book-open me-2"></i>
					Quản lý mượn sách
				</RouterLink>

				<nav class="d-flex flex-wrap align-items-center gap-2">
					<RouterLink :to="{ name: 'dashboard' }" class="nav-link text-white">
						Tổng quan
					</RouterLink>

					<RouterLink :to="{ name: 'sach-list' }" class="nav-link text-white">
						Sách
					</RouterLink>

					<RouterLink
						:to="{ name: 'nha-xuat-ban-list' }"
						class="nav-link text-white"
					>
						Nhà xuất bản
					</RouterLink>

					<RouterLink
						:to="{ name: 'doc-gia-list' }"
						class="nav-link text-white"
					>
						Độc giả
					</RouterLink>

					<RouterLink
						:to="{ name: 'theo-doi-muon-sach-list' }"
						class="nav-link text-white"
					>
						Mượn và trả
					</RouterLink>
				</nav>

				<div class="d-flex align-items-center gap-3">
					<div class="text-end">
						<div class="small fw-semibold">
							{{ currentUser?.HoTenNV ?? "Nhân viên" }}
						</div>

						<div class="small text-white-50">
							{{ currentUser?.ChucVu }}
						</div>
					</div>

					<button
						type="button"
						class="btn btn-sm btn-outline-light"
						@click="handleLogout"
					>
						<i class="fa-solid fa-right-from-bracket me-2"></i>
						Đăng xuất
					</button>
				</div>
			</div>
		</header>

		<div class="app-content container-fluid px-4 py-4">
			<RouterView />
		</div>
	</div>
</template>
