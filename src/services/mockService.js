// Mock data for demo purposes
let mockSecrets = [
  { id: '1', name: 'AWS_ACCESS_KEY', value: 'AKIAIOSFODNN7EXAMPLE', category: 'api', description: 'AWS production access key', status: 'active', createdAt: '2024-11-15T10:30:00Z', updatedAt: '2024-12-01T14:22:00Z' },
  { id: '2', name: 'DATABASE_URL', value: 'postgresql://admin:secret@prod-db:5432/maindb', category: 'database', description: 'Production database connection string', status: 'active', createdAt: '2024-10-20T08:00:00Z', updatedAt: '2024-11-28T09:15:00Z' },
  { id: '3', name: 'JWT_SECRET_KEY', value: 'x9K2mP8nQ3rT6vW1yZ4aB7cD0eF5gH', category: 'token', description: 'JWT signing secret', status: 'active', createdAt: '2024-09-05T16:45:00Z', updatedAt: '2024-12-03T11:00:00Z' },
  { id: '4', name: 'STRIPE_SECRET_KEY', value: 'sk_live_51H4xE2LkdIwHuP8a9mN3oQ', category: 'api', description: 'Stripe payment processing key', status: 'inactive', createdAt: '2024-08-12T13:20:00Z', updatedAt: '2024-10-14T17:30:00Z' },
  { id: '5', name: 'SSL_CERTIFICATE', value: '-----BEGIN CERTIFICATE-----\nMIIFazCCA1OgAwIBA...', category: 'certificate', description: 'SSL certificate for prod domain', status: 'active', createdAt: '2024-07-01T09:00:00Z', updatedAt: '2024-11-30T12:00:00Z' },
  { id: '6', name: 'REDIS_PASSWORD', value: 'R3d1sS3cur3P@ss!2024', category: 'password', description: 'Redis cluster authentication', status: 'active', createdAt: '2024-12-01T10:00:00Z', updatedAt: '2024-12-01T10:00:00Z' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async ({ username, password }) => {
    await delay(800);
    if (username === 'admin' && password === 'Admin123!') {
      return {
        user: { id: '1', username: 'admin', email: 'admin@securesplit.io', company: 'SecureSplit Corp', role: 'admin' },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTcwMDAwMDAwMH0.mock_token_signature',
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (data) => {
    await delay(1000);
    return { success: true, message: 'Account created' };
  },
};

export const secretsService = {
  getAll: async ({ search = '', page = 1, limit = 10, category = '' } = {}) => {
    await delay(600);
    let filtered = [...mockSecrets];
    if (search) filtered = filtered.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (category) filtered = filtered.filter(s => s.category === category);
    const total = filtered.length;
    const start = (page - 1) * limit;
    return { data: filtered.slice(start, start + limit), total, page, totalPages: Math.ceil(total / limit) };
  },

  getById: async (id) => {
    await delay(400);
    const secret = mockSecrets.find(s => s.id === id);
    if (!secret) throw new Error('Secret not found');
    return secret;
  },

  create: async (data) => {
    await delay(700);
    const newSecret = { ...data, id: String(Date.now()), status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    mockSecrets.unshift(newSecret);
    return newSecret;
  },

  update: async (id, data) => {
    await delay(600);
    const index = mockSecrets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Secret not found');
    mockSecrets[index] = { ...mockSecrets[index], ...data, updatedAt: new Date().toISOString() };
    return mockSecrets[index];
  },

  delete: async (id) => {
    await delay(500);
    mockSecrets = mockSecrets.filter(s => s.id !== id);
    return { success: true };
  },

  getStats: async () => {
    await delay(300);
    return {
      total: mockSecrets.length,
      active: mockSecrets.filter(s => s.status === 'active').length,
      lastAccess: new Date().toISOString(),
      categories: mockSecrets.reduce((acc, s) => { acc[s.category] = (acc[s.category] || 0) + 1; return acc; }, {}),
    };
  },
};

export const certificateService = {
  upload: async (file, username, password) => {
    await delay(2000); // Simulate scanning
    const validExtensions = ['.pem', '.crt', '.key'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) throw new Error('Invalid file extension');
    return { success: true, fingerprint: 'SHA256:' + Math.random().toString(36).substring(2, 15), validUntil: '2026-12-31' };
  },
};
