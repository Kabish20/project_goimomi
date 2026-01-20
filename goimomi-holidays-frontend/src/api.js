import axios from "axios";

const api = axios.create({
    baseURL: "/"
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops if refresh endpoint itself fails
        if (originalRequest.url.includes('/api/token/refresh/')) {
            return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (refreshToken) {
                    const response = await axios.post('/api/token/refresh/', {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem("accessToken", newAccessToken);

                    // Update header for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    // Update header for the original request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return api(originalRequest);
                }
            } catch (err) {
                // Refresh token expired or invalid
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("adminUser");
                // Redirect to login
                window.location.href = "/admin-login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
