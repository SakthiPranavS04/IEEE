const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchWrapper = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }
  return response.json();
};

export const eventService = {
  getAll: () => fetchWrapper(`${API}/events`),
  getById: (id) => fetchWrapper(`${API}/events/${id}`)
};

export const galleryService = {
  getAll: () => fetchWrapper(`${API}/gallery`),
};

export const videoService = {
  getAll: () => fetchWrapper(`${API}/videos`),
};

export const newsService = {
  getAll: () => fetchWrapper(`${API}/newsitems`),
};

export const documentService = {
  getAll: () => fetchWrapper(`${API}/settings/ieee_documents`).then(res => {
    try { return JSON.parse(res.value || '[]'); } catch(e) { return []; }
  }).catch(() => []),
};

export const achievementsService = {
  getAll: () => fetchWrapper(`${API}/achievements`),
};

export const societiesService = {
  getAll: () => fetchWrapper(`${API}/societies`),
};

export const committeesService = {
  getAll: () => fetchWrapper(`${API}/committees`),
};

export const teamService = {
  getAll: () => fetchWrapper(`${API}/teams`),
};

export const sponsorService = {
  getAll: () => fetchWrapper(`${API}/sponsors`),
};

export const announcementService = {
  getAll: () => fetchWrapper(`${API}/announcements`),
};

export const formTemplateService = {
  getAll: () => fetchWrapper(`${API}/settings/ieee_request_forms`).then(res => {
    try { return JSON.parse(res.value || '[]'); } catch(e) { return []; }
  }).catch(() => []),
};

export const formSubmissionService = {
  create: (data) => fetchWrapper(`${API}/formsubmissions`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
};

export const settingsService = {
  getAll: () => fetchWrapper(`${API}/settings`),
  get: (key) => fetchWrapper(`${API}/settings/${key}`)
};

export const researchService = {
  getAll: () => fetchWrapper(`${API}/research`),
};

// POST requests from public website users
export const contactService = {
  submit: (data) => fetchWrapper(`${API}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};

export const joinService = {
  submit: (data) => fetchWrapper(`${API}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};

export const feedbackService = {
  submit: (data) => fetchWrapper(`${API}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};

export const newsletterService = {
  subscribe: (data) => fetchWrapper(`${API}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
};

export default API;
