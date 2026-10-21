import api from './api';

export const evidenceService = {
  async upload(formData) {
    const response = await api.post('/evidence/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async list(filters = {}) {
    const params = new URLSearchParams();
    if (filters.caseNumber) params.append('caseNumber', filters.caseNumber);
    if (filters.tag) params.append('tag', filters.tag);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/evidence?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/evidence/${id}`);
    return response.data;
  },

  async verify(id) {
    const response = await api.post(`/evidence/${id}/verify`);
    return response.data;
  },

  async transfer(id, targetUsername, transferNote) {
    const response = await api.post(`/evidence/${id}/transfer`, {
      targetUsername,
      transferNote,
    });
    return response.data;
  },

  async simulateTamper(id) {
    const response = await api.post(`/evidence/${id}/tamper-simulate`);
    return response.data;
  },

  getDownloadUrl(id) {
    return `/api/evidence/${id}/download`;
  },

  getCertificateUrl(id) {
    return `/api/evidence/${id}/certificate`;
  },

  async getCustodyLogs(evidenceId) {
    const response = await api.get(`/custody/evidence/${evidenceId}`);
    return response.data;
  },

  async getRecentCustody() {
    const response = await api.get('/custody/recent');
    return response.data;
  },

  async getRedacted(id) {
    const response = await api.get(`/evidence/${id}/redacted`);
    return response.data;
  },

  async getSummary(id) {
    const response = await api.get(`/evidence/${id}/summary`);
    return response.data;
  }
};
