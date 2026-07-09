export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('ieee_admin_token');
  
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const authService = {
  login: async (email, password) => {
    return authFetch(`${API}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  register: async (email, password) => {
    return authFetch(`${API}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }
};

export const eventService = {
  getAll: () => authFetch(`${API}/events`),
  getById: (id) => authFetch(`${API}/events/${id}`),
  create: (data) => authFetch(`${API}/events`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/events/${id}`, { method: 'DELETE' })
};

export const galleryService = {
  getAll: () => authFetch(`${API}/gallery`),
  create: (data) => authFetch(`${API}/gallery`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/gallery/${id}`, { method: 'DELETE' })
};

export const newsService = {
  getAll: () => authFetch(`${API}/newsitems`),
  create: (data) => authFetch(`${API}/newsitems`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/newsitems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/newsitems/${id}`, { method: 'DELETE' })
};

export const documentService = {
  getAll: () => authFetch(`${API}/documents`),
  create: (data) => authFetch(`${API}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/documents/${id}`, { method: 'DELETE' })
};

export const teamService = {
  getAll: () => authFetch(`${API}/teams`),
  create: (data) => authFetch(`${API}/teams`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/teams/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/teams/${id}`, { method: 'DELETE' })
};

export const achievementsService = {
  getAll: () => authFetch(`${API}/achievements`),
  create: (data) => authFetch(`${API}/achievements`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/achievements/${id}`, { method: 'DELETE' })
};

export const societiesService = {
  getAll: () => authFetch(`${API}/societies`),
  create: (data) => authFetch(`${API}/societies`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/societies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/societies/${id}`, { method: 'DELETE' })
};

export const committeesService = {
  getAll: () => authFetch(`${API}/committees`),
  create: (data) => authFetch(`${API}/committees`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/committees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/committees/${id}`, { method: 'DELETE' })
};

export const settingsService = {
  getAll: () => authFetch(`${API}/settings`),
  get: (key) => authFetch(`${API}/settings/${key}`),
  set: async (key, value) => {
    try {
      return await authFetch(`${API}/settings/${key}`, { 
        method: 'PUT', 
        body: JSON.stringify({ value }) 
      });
    } catch (error) {
      if (error.message === 'Setting not found') {
        return await authFetch(`${API}/settings`, { 
          method: 'POST', 
          body: JSON.stringify({ key, value }) 
        });
      }
      throw error;
    }
  }
};

export const videoService = {
  getAll: () => authFetch(`${API}/videos`),
  create: (data) => authFetch(`${API}/videos`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/videos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/videos/${id}`, { method: 'DELETE' })
};

export const sponsorService = {
  getAll: () => authFetch(`${API}/sponsors`),
  create: (data) => authFetch(`${API}/sponsors`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/sponsors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/sponsors/${id}`, { method: 'DELETE' })
};

export const announcementService = {
  getAll: () => authFetch(`${API}/announcements`),
  create: (data) => authFetch(`${API}/announcements`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/announcements/${id}`, { method: 'DELETE' })
};

export const contactService = {
  getAll: () => authFetch(`${API}/contact`),
  update: (id, data) => authFetch(`${API}/contact/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/contact/${id}`, { method: 'DELETE' })
};

export const joinService = {
  getAll: () => authFetch(`${API}/join`),
  update: (id, data) => authFetch(`${API}/join/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/join/${id}`, { method: 'DELETE' })
};

export const researchService = {
  getAll: () => authFetch(`${API}/research`),
  create: (data) => authFetch(`${API}/research`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/research/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/research/${id}`, { method: 'DELETE' })
};

export const formTemplateService = {
  getAll: () => authFetch(`${API}/formtemplates`),
  create: (data) => authFetch(`${API}/formtemplates`, { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => authFetch(`${API}/formtemplates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => authFetch(`${API}/formtemplates/${id}`, { method: 'DELETE' })
};

export const feedbackService = {
  getAll: () => authFetch(`${API}/feedback`),
  delete: (id) => authFetch(`${API}/feedback/${id}`, { method: 'DELETE' })
};

export const newsletterService = {
  getAll: () => authFetch(`${API}/newsletter`),
  delete: (id) => authFetch(`${API}/newsletter/${id}`, { method: 'DELETE' })
};

export const dashboardService = {
  getStats: () => authFetch(`${API}/dashboard/stats`),
  getData: () => authFetch(`${API}/dashboard`)
};

export default API;
