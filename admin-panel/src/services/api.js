export const API = import.meta.env.VITE_API_URL;

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('ieee_admin_token') || localStorage.getItem('token') || localStorage.getItem('ieee_token');
  
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
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  }
  return response;
};

// Generic CRUD factory to quickly generate services
const createCrudService = (endpoint) => ({
  getAll: () => authFetch(`${API}/${endpoint}`).then(res => res.json()),
  getById: (id) => authFetch(`${API}/${endpoint}/${id}`).then(res => res.json()),
  create: (data) => authFetch(`${API}/${endpoint}`, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  update: (id, data) => authFetch(`${API}/${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json()),
  delete: (id) => authFetch(`${API}/${endpoint}/${id}`, { method: 'DELETE' }).then(res => res.json()),
});

// Setting KV operations
export const settingsService = {
  get: (key) => authFetch(`${API}/settings/${key}`).then(res => res.json()).then(data => data.value).catch(() => null),
  set: (key, value) => authFetch(`${API}/settings/${key}`, { method: 'PUT', body: JSON.stringify({ value }) }).catch(() => authFetch(`${API}/settings`, { method: 'POST', body: JSON.stringify({ key, value }) })),
  getAll: () => authFetch(`${API}/settings`).then(res => res.json()),
};

export const eventsService = createCrudService('events');
export const documentsService = createCrudService('documents');
export const achievementsService = createCrudService('achievements');
export const committeesService = createCrudService('committees');
export const societiesService = createCrudService('societies');
export const formtemplatesService = createCrudService('formtemplates');
export const videosService = createCrudService('videos');
export const newsitemsService = createCrudService('newsitems');
export const galleryService = createCrudService('gallery');
export const teamService = createCrudService('team');

export default API;
