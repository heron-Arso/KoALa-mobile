import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
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
                // 리프레시도 만료 → 인증 만료 이벤트 발행 (AuthContext가 수신)
                // window.location.href = '/login' 쓰면 전체 리로드 → getMyProfile 재호출 → 무한루프
                window.dispatchEvent(new Event('auth:expired'));
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
