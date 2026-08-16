<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
	createDocGia,
	getDocGiaById,
	updateDocGia,
} from "../services/doc-gia.service.js";

const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

const form = reactive({
	MaDocGia: "",
	HoLot: "",
	Ten: "",
	NgaySinh: "",
	Phai: "",
	DiaChi: "",
	DienThoai: "",
});

const isEditMode = computed(() => {
	return Boolean(route.params.maDocGia);
});

const pageTitle = computed(() => {
	return isEditMode.value ? "Chỉnh sửa độc giả" : "Thêm độc giả";
});

function formatDateForInput(dateValue) {
	if (!dateValue) {
		return "";
	}

	return String(dateValue).slice(0, 10);
}

async function loadDocGia() {
	if (!isEditMode.value) {
		return;
	}

	const docGia = await getDocGiaById(route.params.maDocGia);

	form.MaDocGia = docGia.MaDocGia;
	form.HoLot = docGia.HoLot;
	form.Ten = docGia.Ten;
	form.NgaySinh = formatDateForInput(docGia.NgaySinh);
	form.Phai = docGia.Phai;
	form.DiaChi = docGia.DiaChi;
	form.DienThoai = docGia.DienThoai;
}

function validateForm() {
	if (!form.MaDocGia.trim()) {
		return "Mã độc giả không được để trống";
	}

	if (!form.HoLot.trim()) {
		return "Họ lót không được để trống";
	}

	if (!form.Ten.trim()) {
		return "Tên không được để trống";
	}

	if (!form.NgaySinh) {
		return "Ngày sinh không được để trống";
	}

	const ngaySinh = new Date(`${form.NgaySinh}T00:00:00`);

	if (ngaySinh > new Date()) {
		return "Ngày sinh không được nằm trong tương lai";
	}

	if (!form.Phai) {
		return "Vui lòng chọn phái";
	}

	if (!form.DiaChi.trim()) {
		return "Địa chỉ không được để trống";
	}

	if (!form.DienThoai.trim()) {
		return "Số điện thoại không được để trống";
	}

	return "";
}

function createRequestData() {
	return {
		MaDocGia: form.MaDocGia.trim(),
		HoLot: form.HoLot.trim(),
		Ten: form.Ten.trim(),
		NgaySinh: form.NgaySinh,
		Phai: form.Phai,
		DiaChi: form.DiaChi.trim(),
		DienThoai: form.DienThoai.trim(),
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
			delete requestData.MaDocGia;

			await updateDocGia(route.params.maDocGia, requestData);
		} else {
			await createDocGia(requestData);
		}

		await router.push({
			name: "doc-gia-list",
		});
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể lưu thông tin độc giả";
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(async () => {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		await loadDocGia();
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải thông tin độc giả";
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

				<p class="text-secondary mb-0">Nhập thông tin của độc giả</p>
			</div>

			<RouterLink
				:to="{ name: 'doc-gia-list' }"
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

			<p class="text-secondary mt-3 mb-0">Đang tải thông tin độc giả...</p>
		</div>

		<form v-else class="card border-0 shadow-sm" @submit.prevent="handleSubmit">
			<div class="card-body p-4">
				<div class="row g-4">
					<div class="col-md-4">
						<label for="maDocGia" class="form-label"> Mã độc giả </label>

						<input
							id="maDocGia"
							v-model="form.MaDocGia"
							type="text"
							class="form-control"
							:disabled="isEditMode"
							required
						/>
					</div>

					<div class="col-md-5">
						<label for="hoLot" class="form-label"> Họ lót </label>

						<input
							id="hoLot"
							v-model="form.HoLot"
							type="text"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-3">
						<label for="ten" class="form-label"> Tên </label>

						<input
							id="ten"
							v-model="form.Ten"
							type="text"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-4">
						<label for="ngaySinh" class="form-label"> Ngày sinh </label>

						<input
							id="ngaySinh"
							v-model="form.NgaySinh"
							type="date"
							class="form-control"
							required
						/>
					</div>

					<div class="col-md-4">
						<label for="phai" class="form-label"> Phái </label>

						<select id="phai" v-model="form.Phai" class="form-select" required>
							<option value="">-- Chọn phái --</option>
							<option value="Nam">Nam</option>
							<option value="Nữ">Nữ</option>
						</select>
					</div>

					<div class="col-md-4">
						<label for="dienThoai" class="form-label"> Điện thoại </label>

						<input
							id="dienThoai"
							v-model="form.DienThoai"
							type="tel"
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
					:to="{ name: 'doc-gia-list' }"
					class="btn btn-outline-secondary"
				>
					Hủy
				</RouterLink>

				<button type="submit" class="btn btn-primary" :disabled="isSubmitting">
					{{
						isSubmitting
							? "Đang lưu..."
							: isEditMode
								? "Lưu thay đổi"
								: "Thêm độc giả"
					}}
				</button>
			</div>
		</form>
	</div>
</template>
