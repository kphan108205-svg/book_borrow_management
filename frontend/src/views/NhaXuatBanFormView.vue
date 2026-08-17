<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
	createNhaXuatBan,
	updateNhaXuatBan,
	getNhaXuatBanById,
} from "../services/nha-xuat-ban.service.js";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
	MaNXB: "",
	TenNXB: "",
	DiaChi: "",
});

const isEditMode = computed(() => {
	return Boolean(route.params.maNXB);
});

const pageTitle = computed(() => {
	return isEditMode ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản";
});

async function loadNhaXuatBan() {
	if (!isEditMode.value) {
		return;
	}

	const nhaXuatBan = await getNhaXuatBanById(route.params.maNXB);

	form.MaNXB = nhaXuatBan.MaNXB;
	form.TenNXB = nhaXuatBan.TenNXB;
	form.DiaChi = nhaXuatBan.DiaChi;
}

function validateForm() {
	if (!form.MaNXB.trim()) {
		return "Mã nhà xuất bản không được để trống";
	}

	if (!form.TenNXB.trim()) {
		return "Tên nhà xuất bản không được để trống";
	}

	if (!form.DiaChi.trim()) {
		return "Địa chỉ không được để trống";
	}

	return "";
}

function createRequestData() {
	return {
		MaNXB: form.MaNXB.trim(),
		TenNXB: form.TenNXB.trim(),
		DiaChi: form.DiaChi.trim(),
	};
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
			delete requestData.MaNXB;

			await updateNhaXuatBan(route.params.maNXB, requestData);
		} else {
			await createNhaXuatBan(requestData);
		}

		await router.push({
			name: "nha-xuat-ban-list",
		});
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể lưu thông tin nhà xuất bản";
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(async () => {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		await loadNhaXuatBan();
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải thông tin nhà xuất bản";
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

				<p class="text-secondary mb-0">Nhập thông tin của nhà xuất bản</p>
			</div>

			<RouterLink
				:to="{ name: 'nha-xuat-ban-list' }"
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

			<p class="text-secondary mt-3 mb-0">Đang tải thông tin nhà xuất bản...</p>
		</div>

		<form v-else class="card border-0 shadow-sm" @submit.prevent="handleSubmit">
			<div class="card-body p-4">
				<div class="row g-4">
					<div class="col-md-4">
						<label for="maNXB" class="form-label"> Mã nhà xuất bản </label>

						<input
							id="maNXB"
							v-model="form.MaNXB"
							type="text"
							class="form-control"
							:disabled="isEditMode"
							required
						/>
					</div>

					<div class="col-md-8">
						<label for="tenNXB" class="form-label"> Tên nhà xuất bản </label>

						<input
							id="tenNXB"
							v-model="form.TenNXB"
							type="text"
							class="form-control"
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
					:to="{ name: 'nha-xuat-ban-list' }"
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
								: "Thêm nhà xuất bản"
					}}
				</button>
			</div>
		</form>
	</div>
</template>
