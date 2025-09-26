import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5001/api'
      : 'https://chat-app-6rw1.onrender.com/api',
  withCredentials: true,
});

export default axiosInstance;
