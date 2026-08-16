<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

import { login } from "../services/auth.service.js";

const router = useRouter();

const msnv = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

async function handleSubmit() {
  errorMessage.value = "";

  if (!msnv.value.trim() || !password.value) {
    errorMessage.value = "Vui lòng nhập mã nhân viên và mật khẩu";
    return;
  }

  isLoading.value = true;

  try {
    await login({
      MSNV: msnv.value.trim(),
      Password: password.value,
    });

    await router.push({
      name: "dashboard",
    });
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ?? "Không thể kết nối đến máy chủ";
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main class="login-page d-flex align-items-center justify-content-center">
    <div class="card login-card border-0 shadow">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <i class="fa-solid fa-book-open fa-3x text-primary"></i>

          <h1 class="h3 mt-3 mb-1">Quản lý mượn sách</h1>

          <p class="text-secondary mb-0">Đăng nhập bằng tài khoản nhân viên</p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="msnv" class="form-label"> Mã số nhân viên </label>

            <input
              id="msnv"
              v-model="msnv"
              type="text"
              class="form-control"
              placeholder="Ví dụ: NV001"
              autocomplete="username"
            />
          </div>

          <div class="mb-4">
            <label for="password" class="form-label"> Mật khẩu </label>

            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control"
              placeholder="Nhập mật khẩu"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="isLoading"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm me-2"
            ></span>

            <i v-else class="fa-solid fa-right-to-bracket me-2"></i>

            {{ isLoading ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>
        </form>

        <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </main>
</template>
