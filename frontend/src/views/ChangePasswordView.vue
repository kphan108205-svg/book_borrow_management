<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { getCurrentUser } from "../services/auth.service.js";
import { changePassword } from "../services/nhan-vien.service.js";

const router = useRouter();
const currentUser = getCurrentUser();

const isSubmitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const form = reactive({
	CurrentPassword: "",
	NewPassword: "",
	ConfirmPassword: "",
});

function validateForm() {
	if (!form.CurrentPassword.trim()) {
		return "Mật khẩu hiện tại không được để trống";
	}

	if (!form.NewPassword.trim()) {
		return "Mật khẩu mới không được để trống";
	}

	if (form.NewPassword.length < 8) {
		return "Mật khẩu mới phải có ít nhất 8 ký tự";
	}

	if (form.CurrentPassword === form.NewPassword) {
		return "Mật khẩu mới phải khác mật khẩu hiện tại";
	}

	if (!form.ConfirmPassword.trim()) {
		return "Xác nhận mật khẩu không được để trống";
	}

	if (form.NewPassword !== form.ConfirmPassword) {
		return "Xác nhận mật khẩu không khớp";
	}

	return "";
}

async function handleSubmit() {
	errorMessage.value = "";
	successMessage.value = "";

	const validationError = validateForm();
	if (validationError) {
		errorMessage.value = validationError;
		return;
	}

	isSubmitting.value = true;

	try {
		await changePassword(currentUser.MSNV, {
			CurrentPassword: form.CurrentPassword.trim(),
			NewPassword: form.NewPassword.trim(),
		});

		successMessage.value = "Thay đổi mật khẩu thành công!";

		form.CurrentPassword = "";
		form.NewPassword = "";
		form.ConfirmPassword = "";

		setTimeout(() => {
			router.push({ name: "dashboard" });
		}, 1500);
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể thay đổi mật khẩu";
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Thay đổi mật khẩu</h1>

				<p class="text-secondary mb-0">Cập nhật mật khẩu của bạn</p>
			</div>

			<RouterLink :to="{ name: 'dashboard' }" class="btn btn-outline-secondary">
				<i class="fa-solid fa-arrow-left me-2"></i>
				Quay lại
			</RouterLink>
		</div>

		<div class="row justify-content-center">
			<div class="col-md-6 col-lg-5">
				<div v-if="errorMessage" class="alert alert-danger">
					{{ errorMessage }}
				</div>

				<div v-if="successMessage" class="alert alert-success">
					{{ successMessage }}
				</div>

				<form class="card border-0 shadow-sm" @submit.prevent="handleSubmit">
					<div class="card-body p-4">
						<div class="mb-4">
							<label for="currentPassword" class="form-label">
								Mật khẩu hiện tại
							</label>

							<input
								id="currentPassword"
								v-model="form.CurrentPassword"
								type="password"
								class="form-control"
								placeholder="Nhập mật khẩu hiện tại"
								required
							/>
						</div>

						<div class="mb-4">
							<label for="newPassword" class="form-label"> Mật khẩu mới </label>

							<input
								id="newPassword"
								v-model="form.NewPassword"
								type="password"
								class="form-control"
								placeholder="Tối thiểu 8 ký tự"
								required
							/>
						</div>

						<div class="mb-4">
							<label for="confirmPassword" class="form-label">
								Xác nhận mật khẩu mới
							</label>

							<input
								id="confirmPassword"
								v-model="form.ConfirmPassword"
								type="password"
								class="form-control"
								placeholder="Nhập lại mật khẩu mới"
								required
							/>
						</div>
					</div>

					<div class="card-footer d-flex justify-content-end gap-2 px-4 py-3">
						<RouterLink
							:to="{ name: 'dashboard' }"
							class="btn btn-outline-secondary"
						>
							Hủy
						</RouterLink>

						<button
							type="submit"
							class="btn btn-primary"
							:disabled="isSubmitting"
						>
							<span
								v-if="isSubmitting"
								class="spinner-border spinner-border-sm me-2"
								role="status"
							></span>

							{{ isSubmitting ? "Đang lưu..." : "Thay đổi mật khẩu" }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
