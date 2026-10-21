import api from './api';

export const alertService = {
  async getAlerts() {
    const response = await api.get('/alerts');
    return response.data;
  },

  async resolveAlert(id) {
    const response = await api.post(`/alerts/${id}/resolve`);
    return response.data;
  },

  async simulateAttack(username) {
    const response = await api.post(`/admin/attack-simulate/${username}`);
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async unlockUser(userId) {
    const response = await api.post(`/admin/users/${userId}/unlock`);
    return response.data;
  },

  async lockUser(userId) {
    const response = await api.post(`/admin/users/${userId}/lock`);
    return response.data;
  }
};
