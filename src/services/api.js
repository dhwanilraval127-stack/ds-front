import axios from 'axios';

/**
 * IMPORTANT:
 * Vercel env variable MUST be:
 * VITE_API_BASE=https://xxxxx.ngrok-free.dev
 */
const API_BASE = import.meta.env.VITE_API_BASE;

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 60000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An error occurred';

    return {
      success: false,
      error: true,
      message,
      data: null,
    };
  }
);

// Helper
const handleResponse = (response) => {
  if (response?.error) {
    throw new Error(response.message);
  }
  return response;
};

// -------------------- LOCATION --------------------
export const locationAPI = {
  reverseGeocode: async (latitude, longitude) =>
    handleResponse(await api.post('/location/reverse', { latitude, longitude })),

  getStates: async () => api.get('/location/states'),
  getSubdivisions: async () => api.get('/location/subdivisions'),
};

// -------------------- PLANT DISEASE --------------------
export const plantDiseaseAPI = {
  detect: async (file, language = 'EN') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    return handleResponse(
      await api.post('/plant-disease/detect', formData, {
        timeout: 120000,
      })
    );
  },
};

// -------------------- SOIL --------------------
export const soilAPI = {
  detectType: async (file, language = 'EN') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    return handleResponse(
      await api.post('/soil/detect', formData, {
        timeout: 120000,
      })
    );
  },

  assessHealth: async (data) =>
    handleResponse(await api.post('/soil-health/assess', data)),
};

// -------------------- CROP --------------------
export const cropAPI = {
  recommend: async (data) =>
    handleResponse(await api.post('/crop/recommend', data)),

  getCropList: async () => api.get('/yield/crops'),
};

// -------------------- WEATHER & RISK --------------------
export const weatherAPI = {
  predictFlood: async (data) =>
    handleResponse(await api.post('/flood/predict', data)),

  predictStorm: async (data) =>
    handleResponse(await api.post('/storm/predict', data)),

  predictRainfall: async (data) =>
    handleResponse(await api.post('/rainfall/predict', data)),

  predictAQI: async (data) =>
    handleResponse(await api.post('/aqi/predict', data)),

  predictCO2: async (data) =>
    handleResponse(await api.post('/co2/predict', data)),

  analyzeNDVI: async (data) =>
    handleResponse(await api.post('/ndvi/analyze', data)),
};

// -------------------- MARKET --------------------
export const marketAPI = {
  predictYield: async (data) =>
    handleResponse(await api.post('/yield/predict', data)),

  getSeasons: async () => api.get('/yield/seasons'),

  predictPrice: async (data) =>
    handleResponse(await api.post('/price/predict', data)),

  calculateProfit: async (data) =>
    handleResponse(await api.post('/profit/calculate', data)),
};

// -------------------- WATER --------------------
export const waterAPI = {
  calculateRequirement: async (data) =>
    handleResponse(await api.post('/water/calculate', data)),

  getGrowthStages: async (language = 'EN') =>
    api.get('/water/growth-stages', { params: { language } }),
};

export default api;
