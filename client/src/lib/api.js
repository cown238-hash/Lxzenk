/* Thin fetch wrapper around the LXZENK API.
   Relative URLs so the same code works in dev (Vite proxy) and production
   (Express serves the built SPA). */

async function request(path, { method = 'GET', body, signal } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  // public
  getProjects: () => request('/projects'),
  getArticles: () => request('/articles'),
  sendMessage: (payload) => request('/public/contact', { method: 'POST', body: payload }),
  subscribe: (email) => request('/public/subscribe', { method: 'POST', body: { email } }),

  // auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: (signal) => request('/auth/me', { signal }),

  // cms
  stats: () => request('/cms/stats'),
  listProjects: () => request('/cms/projects'),
  getProject: (slug) => request(`/cms/projects/${slug}`),
  createProject: (payload) => request('/cms/projects', { method: 'POST', body: payload }),
  updateProject: (slug, payload) => request(`/cms/projects/${slug}`, { method: 'PUT', body: payload }),
  deleteProject: (slug) => request(`/cms/projects/${slug}`, { method: 'DELETE' }),

  listArticles: () => request('/cms/articles'),
  createArticle: (payload) => request('/cms/articles', { method: 'POST', body: payload }),
  updateArticle: (slug, payload) => request(`/cms/articles/${slug}`, { method: 'PUT', body: payload }),
  deleteArticle: (slug) => request(`/cms/articles/${slug}`, { method: 'DELETE' }),

  listMessages: () => request('/cms/messages'),
  setMessageRead: (id, read) => request(`/cms/messages/${id}`, { method: 'PATCH', body: { read } }),
  deleteMessage: (id) => request(`/cms/messages/${id}`, { method: 'DELETE' }),

  listSubscribers: () => request('/cms/subscribers'),
  deleteSubscriber: (id) => request(`/cms/subscribers/${id}`, { method: 'DELETE' }),
};

export const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
