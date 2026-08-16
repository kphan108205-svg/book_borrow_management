<template>
	<main class="container-fluid px-4 py-4">
		<div class="mb-4">
			<h1 class="h3 mb-1">Tổng quan thư viện</h1>

			<p class="text-secondary mb-0">Theo dõi hoạt động mượn và trả sách</p>
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

		<div class="alert alert-info mt-4 mb-0">
			Các số liệu hiện đang là dữ liệu minh họa. Ta sẽ ưu tiên hoàn thiện các
			trang CRUD trước.
		</div>
	</main>
</template>
