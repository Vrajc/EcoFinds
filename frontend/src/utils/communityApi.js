import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Community Impact API calls
export const communityAPI = {
  // Get community statistics
  getStats: async () => {
    try {
      const response = await api.get('/community/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw error;
    }
  },

  // Get current challenge
  getCurrentChallenge: async () => {
    try {
      const response = await api.get('/community/challenge');
      return response.data;
    } catch (error) {
      console.error('Error fetching current challenge:', error);
      throw error;
    }
  },

  // Get leaderboard
  getLeaderboard: async () => {
    try {
      const response = await api.get('/community/leaderboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Get milestones
  getMilestones: async () => {
    try {
      const response = await api.get('/community/milestones');
      return response.data;
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  },

  // Get recent activities
  getActivities: async () => {
    try {
      const response = await api.get('/community/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  // Get user's personal impact
  getUserImpact: async () => {
    try {
      const response = await api.get('/community/user-impact');
      return response.data;
    } catch (error) {
      console.error('Error fetching user impact:', error);
      throw error;
    }
  },

  // Join challenge
  joinChallenge: async (challengeId) => {
    try {
      const response = await api.post('/community/challenge/join', { challengeId });
      return response.data;
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  },

  // Subscribe to live stats (Server-Sent Events)
  subscribeLiveStats: (callback) => {
    try {
      const eventSource = new EventSource(`${API_BASE_URL}/community/live-stats`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Error parsing live stats:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error with live stats connection:', error);
        // Don't throw error, just log it
      };

      return eventSource;
    } catch (error) {
      console.error('Error creating EventSource:', error);
      // Return a mock EventSource for fallback
      return { close: () => {} };
    }
  }
};

export default api;
