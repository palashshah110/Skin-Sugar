import axios from "axios";
// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // your backend base URL
});


// Add token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage/cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global errors (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: handle unauthorized globally
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login?");
      // localStorage.removeItem("token"); // optional logout
    }
    return Promise.reject(error);
  }
);

export default api;
