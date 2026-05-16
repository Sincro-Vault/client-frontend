// Servicios reales conectados al Backend Cliente .NET (puerto 8080).
// Mantiene los mismos nombres exportados que el antiguo mockService.js
// para no romper imports en las páginas.

import api from '../api/client';

// El backend devuelve SecretId como { value: 'guid' }. Lo aplanamos a string.
const flattenId = (idField) => {
  if (!idField) return '';
  if (typeof idField === 'string') return idField;
  if (typeof idField === 'object' && 'value' in idField) return idField.value;
  return String(idField);
};

const normalizeSecret = (s) => ({
  id: flattenId(s.id),
  name: s.name,
  value: s.value || '',
  category: s.category || 'other',
  description: s.description || '',
  status: s.isLocked ? 'inactive' : 'active',
  fragmentCount: s.fragmentCount ?? 0,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

export const authService = {
  login: async ({ username, password }) => {
    const { data } = await api.post('/auth/login', { username, password });
    return {
      user: data.user || { id: '', username, email: '', company: '', role: 'user' },
      token: data.token || data.accessToken,
    };
  },

  register: async ({ username, email, password }) => {
    const { data } = await api.post('/auth/register', { username, email, password });
    return { success: true, message: 'Account created', ...data };
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    return { success: true };
  },
};

export const secretsService = {
  getAll: async ({ search = '', page = 1, limit = 10, category = '' } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;

    const { data } = await api.get('/secrets', { params });
    return {
      data: (data.data || []).map(normalizeSecret),
      total: data.total ?? 0,
      page: data.page ?? page,
      totalPages: data.totalPages ?? 1,
    };
  },

  getById: async (id) => {
    const { data } = await api.get(`/secrets/${id}`);
    return normalizeSecret(data);
  },

  /**
   * Reconstruye y devuelve el valor del secreto en RAM.
   * Soporta envío opcional de coordenadas para geofencing.
   * @returns {Promise<{value: string, secretId: string, reconstructedAt: string}>}
   */
  reveal: async (id, { latitude, longitude, accuracyMeters } = {}) => {
    const body = (latitude != null && longitude != null)
      ? { latitude, longitude, accuracyMeters: accuracyMeters ?? 50 }
      : {};
    const { data } = await api.post(`/secrets/${id}/reveal`, body);
    return data;
  },

  create: async (data) => {
    const body = {
      name: data.name,
      value: data.value,
      category: data.category,
      description: data.description,
    };
    const { data: result } = await api.post('/secrets', body);
    return { id: flattenId(result?.id) || flattenId(result), ...data };
  },

  update: async (id, data) => {
    const { data: result } = await api.put(`/secrets/${id}`, {
      name: data.name,
      description: data.description,
      category: data.category,
    });
    return normalizeSecret(result);
  },

  delete: async (id) => {
    await api.delete(`/secrets/${id}`);
    return { success: true };
  },

  getStats: async () => {
    const { data } = await api.get('/secrets/stats');
    return {
      total: data.total ?? 0,
      active: data.active ?? 0,
      lastAccess: data.lastAccess || new Date().toISOString(),
      categories: data.categories || {},
    };
  },
};

export const certificateService = {
  upload: async (file, username, password) => {
    const form = new FormData();
    form.append('file', file);
    if (username) form.append('username', username);
    if (password) form.append('password', password);

    const { data } = await api.post('/certificates/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
