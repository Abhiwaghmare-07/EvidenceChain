import api from './api';

export const ledgerService = {
  async getBlocks() {
    const response = await api.get('/ledger/blocks');
    return response.data;
  },

  async validateChain() {
    const response = await api.get('/ledger/validate');
    return response.data;
  },

  async getStats() {
    const response = await api.get('/ledger/stats');
    return response.data;
  }
};
