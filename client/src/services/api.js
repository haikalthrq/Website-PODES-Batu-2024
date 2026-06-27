import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const podesService = {
  // Get all villages data with optional filtering
  getAllVillages: async (params = {}) => {
    try {
      const response = await api.get('/villages', { params });
      // Server responds with shape: { success, data: [...], count, ... }
      // Return only the data array to simplify consumers
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Error fetching villages:', error);
      throw error;
    }
  },

  // Get villages comparison data by IDs
  getVillagesComparison: async (ids) => {
    try {
      const response = await api.get('/villages/compare', { 
        params: { ids: ids.join(',') } 
      });
      return response.data?.data ?? [];
    } catch (error) {
      console.error('Error fetching villages comparison:', error);
      throw error;
    }
  },

  // Get metadata for filters
  getMetadata: async () => {
    try {
      const response = await api.get('/villages/metadata');
      // Debug removed
      // Return the full response data since metadata is at top level
      return response.data ?? {};
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error fetching health status:', error);
      throw error;
    }
  }
};

// Alternative export for different import styles
export const villageAPI = podesService;
export default podesService;