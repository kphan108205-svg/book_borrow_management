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
  <main class="container py-5">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
    >
      <div>
        <h1 class="h2 mb-1">Tổng quan thư viện</h1>

        <p class="text-secondary mb-0">Theo dõi hoạt động mượn và trả sách</p>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="text-end">
          <div class="fw-semibold">
            {{ currentUser?.HoTenNV }}
          </div>

          <small class="text-secondary">
            {{ currentUser?.ChucVu }}
          </small>
        </div>

        <button
          type="button"
          class="btn btn-outline-danger"
          @click="handleLogout"
        >
          <i class="fa-solid fa-right-from-bracket me-2"></i>
          Đăng xuất
        </button>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-sm-6 col-xl-3">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fa-solid fa-book fa-2x text-primary mb-3"></i>

            <p class="text-secondary mb-1">Đầu sách</p>

            <p class="display-6 fw-semibold mb-0">0</p>
          </div>
        </article>
      </div>

      <div class="col-sm-6 col-xl-3">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fa-solid fa-users fa-2x text-success mb-3"></i>

            <p class="text-secondary mb-1">Độc giả</p>

            <p class="display-6 fw-semibold mb-0">0</p>
          </div>
        </article>
      </div>

      <div class="col-sm-6 col-xl-3">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fa-solid fa-book-reader fa-2x text-warning mb-3"></i>

            <p class="text-secondary mb-1">Đang mượn</p>

            <p class="display-6 fw-semibold mb-0">0</p>
          </div>
        </article>
      </div>

      <div class="col-sm-6 col-xl-3">
        <article class="card h-100 border-0 shadow-sm">
          <div class="card-body">
            <i class="fa-solid fa-clock fa-2x text-danger mb-3"></i>

            <p class="text-secondary mb-1">Quá hạn</p>

            <p class="display-6 fw-semibold mb-0">0</p>
          </div>
        </article>
      </div>
    </div>

    <section class="card border-0 shadow-sm mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Các chức năng chính</h2>

        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-outline-primary" disabled>
            Quản lý sách
          </button>

          <button type="button" class="btn btn-outline-primary" disabled>
            Quản lý độc giả
          </button>

          <button type="button" class="btn btn-outline-primary" disabled>
            Mượn và trả sách
          </button>
        </div>

        <p class="small text-secondary mt-3 mb-0">
          Các trang chức năng sẽ được kết nối sau khi kiểm tra đăng nhập.
        </p>
      </div>
    </section>
  </main>
</template>
