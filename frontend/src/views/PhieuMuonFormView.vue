<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { getDocGiaList } from "../services/doc-gia.service.js";
import { getSachList } from "../services/sach.service.js";
import { createPhieuMuon } from "../services/theo-doi-muon-sach.service.js";

const router = useRouter();

const docGiaList = ref([]);
const sachList = ref([]);

const isLoading = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref("");

function formatDateForInput(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function getTomorrow() {
	const tomorrow = new Date();

	tomorrow.setDate(tomorrow.getDate() + 1);

	return formatDateForInput(tomorrow);
}

const minHanTra = getTomorrow();

const form = reactive({
	MaDocGia: "",
	MaSach: "",
	HanTra: minHanTra,
});

async function loadFormData() {
	isLoading.value = true;
	errorMessage.value = "";

	try {
		const docGiaResult = await getDocGiaList({
			page: 1,
			limit: 100,
		});

		docGiaList.value = docGiaResult.data;

		const sachResult = await getSachList({
			page: 1,
			limit: 100,
		});

		sachList.value = sachResult.data;
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể tải dữ liệu biểu mẫu";
	} finally {
		isLoading.value = false;
	}
}

function validateForm() {
	if (!form.MaDocGia) {
		return "Vui lòng chọn độc giả";
	}

	if (!form.MaSach) {
		return "Vui lòng chọn sách";
	}

	if (!form.HanTra) {
		return "Vui lòng chọn hạn trả";
	}

	if (form.HanTra < minHanTra) {
		return "Hạn trả phải từ ngày mai trở đi";
	}

	return "";
}

async function handleSubmit() {
	errorMessage.value = validateForm();

	if (errorMessage.value) {
		return;
	}

	isSubmitting.value = true;

	try {
		await createPhieuMuon({
			MaDocGia: form.MaDocGia,
			MaSach: form.MaSach,
			HanTra: form.HanTra,
		});

		await router.push({
			name: "theo-doi-muon-sach-list",
		});
	} catch (error) {
		errorMessage.value =
			error.response?.data?.message ?? "Không thể lập phiếu mượn sách";
	} finally {
		isSubmitting.value = false;
	}
}

onMounted(() => {
	loadFormData();
});
</script>

<template>
	<div>
		<div
			class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4"
		>
			<div>
				<h1 class="h3 mb-1">Lập phiếu mượn sách</h1>

				<p class="text-secondary mb-0">Chọn độc giả, sách và hạn trả</p>
			</div>

			<RouterLink
				:to="{ name: 'theo-doi-muon-sach-list' }"
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

			<p class="text-secondary mt-3 mb-0">Đang tải dữ liệu biểu mẫu...</p>
		</div>

		<form v-else class="card border-0 shadow-sm" @submit.prevent="handleSubmit">
			<div class="card-body p-4">
				<div class="row g-4">
					<div class="col-md-6">
						<label for="maDocGia" class="form-label"> Độc giả </label>

						<select
							id="maDocGia"
							v-model="form.MaDocGia"
							class="form-select"
							required
						>
							<option value="">-- Chọn độc giả --</option>

							<option
								v-for="docGia in docGiaList"
								:key="docGia.MaDocGia"
								:value="docGia.MaDocGia"
							>
								{{ docGia.HoLot }}
								{{ docGia.Ten }}
								({{ docGia.MaDocGia }})
							</option>
						</select>
					</div>

					<div class="col-md-6">
						<label for="maSach" class="form-label"> Sách </label>

						<select
							id="maSach"
							v-model="form.MaSach"
							class="form-select"
							required
						>
							<option value="">-- Chọn sách --</option>

							<option
								v-for="sach in sachList"
								:key="sach.MaSach"
								:value="sach.MaSach"
								:disabled="sach.SoQuyen <= 0"
							>
								{{ sach.TenSach }}
								({{ sach.MaSach }}) -
								{{ sach.SoQuyen > 0 ? `Còn ${sach.SoQuyen} quyển` : "Đã hết" }}
							</option>
						</select>
					</div>

					<div class="col-md-6">
						<label for="hanTra" class="form-label"> Hạn trả </label>

						<input
							id="hanTra"
							v-model="form.HanTra"
							type="date"
							class="form-control"
							:min="minHanTra"
							required
						/>

						<div class="form-text">Hạn trả phải từ ngày mai trở đi.</div>
					</div>
				</div>
			</div>

			<div class="card-footer d-flex justify-content-end gap-2 px-4 py-3">
				<RouterLink
					:to="{
						name: 'theo-doi-muon-sach-list',
					}"
					class="btn btn-outline-secondary"
				>
					Hủy
				</RouterLink>

				<button type="submit" class="btn btn-primary" :disabled="isSubmitting">
					<i v-if="!isSubmitting" class="fa-solid fa-book me-2"></i>

					<span
						v-if="isSubmitting"
						class="spinner-border spinner-border-sm me-2"
						role="status"
					></span>

					{{ isSubmitting ? "Đang lập phiếu..." : "Lập phiếu mượn" }}
				</button>
			</div>
		</form>
	</div>
</template>
