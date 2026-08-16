import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
	timeout: 10000,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const status = error.response?.status;
		const requestURL = error.config?.url ?? "";
		const isLoginRequest = requestURL.includes("/auth/login");

		if (status === 401 && !isLoginRequest) {
			localStorage.removeItem("authToken");
			localStorage.removeItem("authUser");

			if (window.location.pathname !== "/login") {
				window.location.assign("/login");
			}
		}

		return Promise.reject(error);
	},
);

export default api;
