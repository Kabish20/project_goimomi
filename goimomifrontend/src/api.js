import axios from "axios";

const api = axios.create({
    baseURL: ""
});

api.interceptors.request.use(
    (config) => {
        // Skip Authorization header for public endpoints or when skipAuth is set
        const publicEndpoints = [
            '/api/token/',
            '/api/token/refresh/',
            '/api/cities/',
            '/api/pickup-point-masters/',
            '/api/airports/',
            '/api/payment-webhook/',
            '/api/payment-success/',
            '/api/payment-failed/',
            '/api/business-journey-registrations/',
            '/api/businessjourneyregistrations/',
            '/api/chithirai-registrations/',
            '/api/chithirairegistrations/',
            '/api/chithirai-enquiries/',
            '/api/chithiraienquiries/',
            '/api/canton-enquiries/',
            '/api/cantonenquiries/',
            '/api/enquiry-form/',
            '/api/enquiryform/',
            '/api/holiday-form/',
            '/api/holidayform/',
            '/api/umrah-form/',
            '/api/umrahform/'
        ];

        const isPublic = publicEndpoints.some(url => config.url && config.url.includes(url)) || config.skipAuth;

        if (!isPublic) {
            const token = localStorage.getItem("accessToken");
            if (token && token !== "undefined" && token !== "null") {
                config.headers.Authorization = `Bearer ${token}`;
            }
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

        // Prevent infinite loops if refresh or token endpoint itself fails
        if (!originalRequest || originalRequest.url?.includes('/api/token/refresh/') || originalRequest.url?.includes('/api/token/')) {
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
                // Only redirect to admin login if currently on an admin page
                if (window.location.pathname.startsWith('/admin')) {
                    window.location.href = "/admin-login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
