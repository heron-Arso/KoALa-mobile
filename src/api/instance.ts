import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 — 토큰 만료 시 자동 재발급
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
          null,
          { withCredentials: true }
        );
        return instance(originalRequest);
      } catch {
        // 리프레시도 만료 → AuthContext가 auth:expired 이벤트를 수신해 처리
        window.dispatchEvent(new Event('auth:expired'));
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
