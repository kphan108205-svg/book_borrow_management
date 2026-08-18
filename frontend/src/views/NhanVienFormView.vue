<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
	createNhanVien,
	getNhanVienById,
	updateNhanVien,
} from "../services/nhan-vien.service.js";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
	MSNV: "",
	HoTenNV: "",
	Password: "",
	ChucVu: "",
	DiaChi: "",
	SoDienThoai: "",
});

const isEditMode = computed(() => {
	return Boolean(route.params.msnv);
});

const pageTitle = computed(() => {
	return isEditMode.value ? "Chỉnh sửa nhân viên" : "Thêm nhân viên";
});

async function loadNhanVien() {
	if (!isEditMode.value) {
		return;
	}

	const nhanVien = await getNhanVienById(route.params.msnv);

	form.MSNV = nhanVien.MSNV;
	form.HoTenNV = nhanVien.HoTenNV;
	form.ChucVu = nhanVien.ChucVu;
	form.DiaChi = nhanVien.DiaChi;
	form.SoDienThoai = nhanVien.SoDienThoai;
}

function validateForm() {
	if (!form.MSNV.trim()) {
		return "Mã nhân viên không được để trống";
	}

	if (!form.HoTenNV.trim()) {
		return "Họ tên nhân viên không được để trống";
	}

	if (!form.ChucVu) {
		return "Vui lòng chọn chức vụ";
	}

	if (!form.DiaChi.trim()) {
		return "Địa chỉ không được để trống";
	}

	if (!form.SoDienThoai.trim()) {
		return "Số điện thoại không được để trống";
	}

	if (!isEditMode.value && !form.Password.trim()) {
		return "Mật khẩu không được để trống";
	}

	if (!isEditMode.value && form.Password.length < 8) {
		return "Mật khẩu phải có ít nhất 8 ký tự";
	}

	return "";
}

function createRequestData() {
	const data = {
		MSNV: form.MSNV.trim(),
		HoTenNV: form.HoTenNV.trim(),
		ChucVu: form.ChucVu,
		DiaChi: form.DiaChi.trim(),
		SoDienThoai: form.SoDienThoai.trim(),
	};

	if (!isEditMode.value) {
		data.Password = form.Password.trim();
	}

	return data;
}

async function handleSubmit() {
	errorMessage.value = validateForm();

	if (errorMessage.value) {
		return;
	}

	isSubmitting.value = true;

	try {
		const requestData = createRequestData();

		if (isEditMode.value) {
			delete requestData.MSNV;

			await updateNhanVien(route.params.msnv, requestData);
		} else {
			await createNhanVien(requestData);
		}

		await router.push({
			name: "nhan-vien-list",
		});
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể lưu thông tin nhân viên";
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(async () => {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		await loadNhanVien();
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải thông tin nhân viên";
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">
					{{ pageTitle }}
				</h1>

				<p class="text-secondary mb-0">Nhập thông tin của nhân viên</p>
			</div>

			<RouterLink
				:to="{ name: 'nhan-vien-list' }"
				class="btn btn-outline-secondary"
			>
				<i class="fa-solid fa-arrow-left me-2"></i>
				Quay lại
			</RouterLink>
		</div>

		<div v-if="errorMessage" class="alert alert-danger">
			{{ errorMessage }}
		</div>

		<div v-if="isLoading" class="py-5 text-center">
			<div class="spinner-border text-primary" role="status"></div>

			<p class="text-secondary mt-3 mb-0">Đang tải thông tin nhân viên...</p>
		</div>

		<form v-else class="card border-0 shadow-sm" @submit.prevent="handleSubmit">
			<div class="card-body p-4">
				<div class="row g-4">
					<div class="col-md-4">
						<label for="msnv" class="form-label"> Mã nhân viên </label>

						<input
							id="msnv"
							v-model="form.MSNV"
							type="text"
							class="form-control"
							:disabled="isEditMode"
							required
						/>
					</div>

					<div class="col-md-8">
						<label for="hoTenNV" class="form-label"> Họ tên nhân viên </label>

						<input
							id="hoTenNV"
							v-model="form.HoTenNV"
							type="text"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-6">
						<label for="chucVu" class="form-label"> Chức vụ </label>

						<select
							id="chucVu"
							v-model="form.ChucVu"
							class="form-select"
							required
						>
							<option value="">-- Chọn chức vụ --</option>
							<option value="Thủ thư">Thủ thư</option>
							<option value="Quản lý thư viện">Quản lý thư viện</option>
						</select>
					</div>

					<div class="col-md-6">
						<label for="soDienThoai" class="form-label"> Số điện thoại </label>

						<input
							id="soDienThoai"
							v-model="form.SoDienThoai"
							class="form-control"
							required
						/>
					</div>

					<div v-if="!isEditMode" class="col-md-6">
						<label for="password" class="form-label"> Mật khẩu </label>

						<input
							id="password"
							v-model="form.Password"
							type="password"
							class="form-control"
							placeholder="Tối thiểu 8 ký tự"
							required
						/>
					</div>

					<div class="col-12">
						<label for="diaChi" class="form-label"> Địa chỉ </label>

						<input
							id="diaChi"
							v-model="form.DiaChi"
							type="text"
							class="form-control"
							required
						/>
					</div>
				</div>
			</div>

			<div class="card-footer d-flex justify-content-end gap-2 px-4 py-3">
				<RouterLink
					:to="{ name: 'nhan-vien-list' }"
					class="btn btn-outline-secondary"
				>
					Hủy
				</RouterLink>

				<button type="submit" class="btn btn-primary" :disabled="isSubmitting">
					<span
						v-if="isSubmitting"
						class="spinner-border spinner-border-sm me-2"
						role="status"
					></span>

					{{
						isSubmitting
							? "Đang lưu..."
							: isEditMode
								? "Lưu thay đổi"
								: "Thêm nhân viên"
					}}
				</button>
			</div>
		</form>
	</div>
</template>
