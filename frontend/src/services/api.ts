import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Settings API
export const settingsService = {
  getPublicSettings: () => api.get('/settings'),
  getAdminSettings: () => api.get('/settings/admin'),
  updateSettings: (data: any) => api.put('/settings', data),
  updateSettingsSection: (section: string, data: any) => api.put(`/settings/${section}`, data),
  getWorkingHours: () => api.get('/settings/working-hours'),
  toggleMaintenance: (data: any) => api.put('/settings/maintenance', data),
};

// Portfolio API
export const portfolioService = {
  getAll: (params?: any) => api.get('/portfolio', { params }),
  getBySlug: (slug: string) => api.get(`/portfolio/${slug}`),
  getCategories: () => api.get('/portfolio/meta/categories'),
  getTechnologies: () => api.get('/portfolio/meta/technologies'),
  getStats: () => api.get('/portfolio/meta/stats'),
  like: (slug: string) => api.put(`/portfolio/${slug}/like`),
  // Admin routes
  getAllAdmin: (params?: any) => api.get('/portfolio/admin', { params }),
  getByIdAdmin: (id: string) => api.get(`/portfolio/admin/${id}`),
  create: (data: any) => api.post('/portfolio', data),
  update: (id: string, data: any) => api.put(`/portfolio/${id}`, data),
  delete: (id: string) => api.delete(`/portfolio/${id}`),
  toggleFeatured: (id: string) => api.put(`/portfolio/${id}/featured`),
};

// Blog API
export const blogService = {
  getAll: (params?: any) => api.get('/blog', { params }),
  getBySlug: (slug: string) => api.get(`/blog/${slug}`),
  getCategories: () => api.get('/blog/meta/categories'),
  getTags: () => api.get('/blog/meta/tags'),
  getStats: () => api.get('/blog/meta/stats'),
  incrementViews: (slug: string) => api.put(`/blog/${slug}/views`),
  like: (slug: string) => api.put(`/blog/${slug}/like`),
  addComment: (slug: string, data: any) => api.post(`/blog/${slug}/comments`, data),
  // Admin routes
  getAllAdmin: (params?: any) => api.get('/blog/admin', { params }),
  getByIdAdmin: (id: string) => api.get(`/blog/admin/${id}`),
  create: (data: any) => api.post('/blog', data),
  update: (id: string, data: any) => api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
  toggleFeatured: (id: string) => api.put(`/blog/${id}/featured`),
  approveComment: (id: string, commentId: string) => api.put(`/blog/${id}/comments/${commentId}/approve`),
};

// Contact API
export const contactService = {
  submit: (data: any) => api.post('/contact', data),
  // Admin routes
  getAll: (params?: any) => api.get('/contact', { params }),
  getById: (id: string) => api.get(`/contact/${id}`),
  updateStatus: (id: string, status: string) => api.put(`/contact/${id}/status`, { status }),
  toggleStar: (id: string) => api.put(`/contact/${id}/star`),
  addResponse: (id: string, message: string) => api.post(`/contact/${id}/response`, { message }),
  addFollowUp: (id: string, note: string) => api.post(`/contact/${id}/followup`, { note }),
  delete: (id: string) => api.delete(`/contact/${id}`),
  markAsSpam: (id: string, isSpam: boolean) => api.put(`/contact/${id}/spam`, { isSpam }),
  getAnalytics: (params?: any) => api.get('/contact/meta/analytics', { params }),
};

// Skills API
export const skillsService = {
  getAll: (params?: any) => api.get('/skills', { params }),
  getCategories: () => api.get('/skills/meta/categories'),
  getStats: () => api.get('/skills/meta/stats'),
  // Admin routes
  getAllAdmin: (params?: any) => api.get('/skills/admin', { params }),
  getById: (id: string) => api.get(`/skills/${id}`),
  create: (data: any) => api.post('/skills', data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
  toggleHighlight: (id: string) => api.put(`/skills/${id}/highlight`),
  updateProjects: (id: string) => api.put(`/skills/${id}/update-projects`),
  addCertification: (id: string, data: any) => api.post(`/skills/${id}/certifications`, data),
  addResource: (id: string, data: any) => api.post(`/skills/${id}/resources`, data),
  reorder: (skills: Array<{ id: string; sortOrder: number }>) => api.put('/skills/reorder', { skills }),
};

// Auth API
export const authService = {
  login: async (email: string, password: string) => {
    console.log('🔐 API: Making login request to backend...');
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ API: Login request successful');
      return response;
    } catch (error) {
      console.error('❌ API: Login request failed:', error);
      throw error;
    }
  },
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
  logout: () => api.post('/auth/logout'),
  // Admin routes
  getUsers: (params?: any) => api.get('/auth/users', { params }),
  updateUserStatus: (id: string, isActive: boolean) => api.put(`/auth/users/${id}/status`, { isActive }),
  deleteUser: (id: string) => api.delete(`/auth/users/${id}`),
};

// Pages API
export const pagesService = {
  getAll: (params?: any) => api.get('/pages', { params }),
  getBySlug: (slug: string) => api.get(`/pages/${slug}`),
  getById: (id: string) => api.get(`/pages/id/${id}`),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.put(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
  updateSEO: (id: string, seoData: any) => api.put(`/pages/${id}/seo`, seoData),
  getStats: () => api.get('/pages/meta/stats'),
};

// Dashboard API
export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: (params?: any) => api.get('/dashboard/activities', { params }),
  getAnalytics: (params?: any) => api.get('/dashboard/analytics', { params }),
  getTopPages: (params?: any) => api.get('/dashboard/top-pages', { params }),
  getRecentMessages: (params?: any) => api.get('/dashboard/messages', { params }),
};

// Testimonials API
export const testimonialsService = {
  getAll: (params?: any) => api.get('/testimonials', { params }),
  // Admin routes
  getAllAdmin: (params?: any) => api.get('/testimonials/admin', { params }),
  getById: (id: string) => api.get(`/testimonials/${id}`),
  create: (data: any) => api.post('/testimonials', data),
  update: (id: string, data: any) => api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
  toggleStatus: (id: string) => api.put(`/testimonials/${id}/toggle`),
  reorder: (testimonials: Array<{ id: string; sortOrder: number }>) => api.put('/testimonials/reorder', { testimonials }),
};

// Profile API
export const profileService = {
  getPublic: () => api.get('/profile/public'),
  getBySlug: (slug: string) => api.get(`/profile/slug/${slug}`),
  getMe: () => api.get('/profile/me'),
  update: (data: any) => api.put('/profile', data),
  updateSection: (section: string, data: any) => api.put(`/profile/section/${section}`, data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadCover: (file: File) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.post('/profile/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  addExperience: (data: any) => api.post('/profile/experience', data),
  updateExperience: (id: string, data: any) => api.put(`/profile/experience/${id}`, data),
  deleteExperience: (id: string) => api.delete(`/profile/experience/${id}`),
  addSkill: (type: string, data: any) => api.post(`/profile/skills/${type}`, data),
  getAnalytics: () => api.get('/profile/analytics'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;