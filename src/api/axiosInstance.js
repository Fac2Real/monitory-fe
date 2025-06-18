import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (window.location.pathname !== "/login") {
          localStorage.removeItem("isLoggedIn");
          window.location.href = "/login";
        }
      }
      if (error.response.status >= 500) {
        alert("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
