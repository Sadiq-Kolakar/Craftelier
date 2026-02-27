import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('craftelier_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Handle auth errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('craftelier_token');
            localStorage.removeItem('craftelier_user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Users
export const usersAPI = {
    getProfile: (id) => api.get(`/users/${id}`),
    updateProfile: (data) => api.put('/users/profile', data),
    followUser: (id) => api.post(`/users/${id}/follow`),
    unfollowUser: (id) => api.post(`/users/${id}/unfollow`),
    getArtisans: (params) => api.get('/users/artisans', { params }),
};

// Products
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    like: (id) => api.post(`/products/${id}/like`),
};

// Recommendations
export const recommendationsAPI = {
    getCrafts: (params) => api.get('/recommendations/crafts', { params }),
    getArtisans: (params) => api.get('/recommendations/artisans', { params }),
};

export default api;
