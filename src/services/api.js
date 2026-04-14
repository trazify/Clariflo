const API_BASE = '/api';

// Get stored token
const getToken = () => localStorage.getItem('clariflo-token');

// Helper for authenticated requests
const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${url}`, { ...options, headers });

  if (response.status === 401) {
    // Token expired / invalid — clear auth
    localStorage.removeItem('clariflo-token');
    window.location.reload();
    return null;
  }

  return response;
};

// ===== Auth =====

export const apiRegister = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  localStorage.setItem('clariflo-token', data.token);
  return data;
};

export const apiLogin = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  localStorage.setItem('clariflo-token', data.token);
  return data;
};

export const apiLogout = () => {
  localStorage.removeItem('clariflo-token');
};

export const isLoggedIn = () => !!getToken();

// ===== Tasks =====

export const apiFetchTasks = async () => {
  const res = await authFetch('/tasks');
  if (!res) return [];
  return res.json();
};

export const apiCreateTask = async (text) => {
  const res = await authFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  if (!res) return null;
  return res.json();
};

export const apiUpdateTask = async (id, updates) => {
  const res = await authFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  if (!res) return null;
  return res.json();
};

export const apiDeleteTask = async (id) => {
  const res = await authFetch(`/tasks/${id}`, { method: 'DELETE' });
  if (!res) return null;
  return res.json();
};

export const apiReorderTasks = async (tasks) => {
  const res = await authFetch('/tasks/reorder/bulk', {
    method: 'PUT',
    body: JSON.stringify({ tasks })
  });
  if (!res) return null;
  return res.json();
};

// ===== Stats =====

export const apiFetchStats = async () => {
  const res = await authFetch('/stats');
  if (!res) return [];
  return res.json();
};

export const apiRecordSession = async (minutes) => {
  const res = await authFetch('/stats/session', {
    method: 'POST',
    body: JSON.stringify({ minutes })
  });
  if (!res) return null;
  return res.json();
};

export const apiRecordTaskCompleted = async () => {
  const res = await authFetch('/stats/task-completed', {
    method: 'POST',
    body: JSON.stringify({})
  });
  if (!res) return null;
  return res.json();
};

// ===== Settings =====

export const apiFetchSettings = async () => {
  const res = await authFetch('/settings');
  if (!res) return null;
  return res.json();
};

export const apiUpdateSettings = async (settings) => {
  const res = await authFetch('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
  if (!res) return null;
  return res.json();
};
