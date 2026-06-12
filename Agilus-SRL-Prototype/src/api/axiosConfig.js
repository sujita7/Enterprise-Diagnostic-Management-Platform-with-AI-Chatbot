import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/api/';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            // Only try to refresh if it's not the login or refresh endpoint itself
            if (originalRequest.url !== 'login/' && originalRequest.url !== 'token/refresh/') {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        const res = await axios.post(`${baseURL}token/refresh/`, {
                            refresh: refreshToken
                        });
                        
                        if (res.status === 200) {
                            localStorage.setItem('access_token', res.data.access);
                            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
                            originalRequest.headers['Authorization'] = `Bearer ${res.data.access}`;
                            return api(originalRequest);
                        }
                    }
                } catch (refreshError) {
                    // Refresh token is invalid or expired
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    // Optional: Dispatch a logout action or redirect to login page here
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
