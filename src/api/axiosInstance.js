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
    if (error.response && error.response.status === 401) {
      // 세션 만료 또는 인증 실패
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"; // 리다이렉션
        localStorage.removeItem("isLoggedIn"); // 로그인 상태 제거
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
