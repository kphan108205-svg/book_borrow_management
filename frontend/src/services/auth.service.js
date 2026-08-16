import api from "./api.service.js";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export async function login(credentials) {
  const response = await api.post("/auth/login", credentials);

  const { token, nhanVien } = response.data.data;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(nhanVien));

  return nhanVien;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    logout();
    return null;
  }
}
