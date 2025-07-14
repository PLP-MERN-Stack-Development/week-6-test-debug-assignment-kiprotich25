// api.js - API service for making requests to the backend

import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');//Before every request is sent, it checks if the user has a token in localStorage.
    if (token) {//If yes, it adds it to the request's headers as Authorization: Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {//Catches backend errors (especially 401 Unauthorized)
      localStorage.removeItem('token');//Clears the user's token and info from localStorage
      localStorage.removeItem('user');
      window.location.href = '/login';//Redirects user to the /login page
      
    }
    return Promise.reject(error);
  }
);

// Post API services
export const postService = {
  // Get all posts with optional pagination and filters
  getAllPosts: async (page = 1, limit = 10, category = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;  // This creates the base API request URL.
    if (category) {
      url += `&category=${category}`;
    }
    const response = await api.get(url);
    //Sends a GET request to the built URL//Waits for the response to come back
    return response.data;
  },

  // Get a single post by ID or slug
  getPost: async (idOrSlug) => {
    const response = await api.get(`/posts/${idOrSlug}`);
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Delete a post
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Search posts
  searchPosts: async (query) => {
    const response = await api.get(`/posts/search?q=${query}`);
    return response.data;
  },
};

// Category API services
export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
};

// Auth API services
export const authService = {
  // Register a new user
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));//Sends login credentials to the server.If successful, saves the token and user info in localStorage.
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

 
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      // If not found or is "undefined", treat it as null
      if (!user || user === "undefined") return null;
      return JSON.parse(user);
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  },
  // other methods...


//    getCurrentUser: () => {
//    try {
//      const user = localStorage.getItem('user');
//      if (!user) return null;
//      return JSON.parse(user);
//   } catch (err) {
//     console.error('Failed to parse user from localStorage', err);
//     return null;
//   }
  
// }

};

export default api; 