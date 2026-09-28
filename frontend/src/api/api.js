import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token and User ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id) {
          config.headers["X-User-ID"] = user.id;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Don't redirect if already on public auth pages
      const path = window.location.pathname;

      if (path !== "/login" && path !== "/register" && path !== "/forgot-password") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
