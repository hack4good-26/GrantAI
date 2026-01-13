import axios, { AxiosInstance, AxiosError } from 'axios';
import type { Grant, GrantIntentProfile, ServiceIdea, GrantMatch } from './types';

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for logging (optional)
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods organized by resource
export const grantsApi = {
  getAll: async (): Promise<Grant[]> => {
    const response = await apiClient.get<Grant[]>('/api/grants');
    return response.data;
  },

  getById: async (id: number): Promise<Grant> => {
    const response = await apiClient.get<Grant>(`/api/grants/${id}`);
    return response.data;
  },

  analyzeGrant: async (id: number): Promise<void> => {
    await apiClient.post(`/api/grants/${id}/analyze`);
  },

  getIntentProfile: async (id: number): Promise<GrantIntentProfile> => {
    const response = await apiClient.get<GrantIntentProfile>(`/api/grants/${id}/intent`);
    return response.data;
  },

  analyzeAll: async (): Promise<void> => {
    await apiClient.post('/api/grants/analyze-all');
  },
};

export const serviceIdeasApi = {
  create: async (data: Omit<ServiceIdea, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceIdea> => {
    const response = await apiClient.post<ServiceIdea>('/api/service-ideas', data);
    return response.data;
  },

  getAll: async (): Promise<ServiceIdea[]> => {
    const response = await apiClient.get<ServiceIdea[]>('/api/service-ideas');
    return response.data;
  },

  getMatches: async (id: number): Promise<GrantMatch[]> => {
    const response = await apiClient.get<GrantMatch[]>(`/api/service-ideas/${id}/matches`);
    return response.data;
  },

  analyzeMatch: async (ideaId: number, grantId: number): Promise<GrantMatch> => {
    const response = await apiClient.post<GrantMatch>(
      `/api/service-ideas/${ideaId}/analyze-match/${grantId}`
    );
    return response.data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get('/api/dashboard/stats');
    return response.data;
  },

  getPriorities: async () => {
    const response = await apiClient.get('/api/dashboard/priorities');
    return response.data;
  },
};

export const explainerApi = {
  explain: async (grantId: number, question: string) => {
    const response = await apiClient.post(`/api/grants/${grantId}/explain`, { question });
    return response.data;
  },

  compare: async (grantIds: number[], criteria?: string) => {
    const response = await apiClient.post('/api/grants/compare', { grant_ids: grantIds, criteria });
    return response.data;
  },
};

// Export the axios instance for custom requests if needed
export default apiClient;
