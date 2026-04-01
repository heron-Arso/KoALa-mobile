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
                return Promise.reject(
                    Object.assign(new Error('AUTH_REQUIRED'), { code: 'AUTH_REQUIRED' })
                );
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
