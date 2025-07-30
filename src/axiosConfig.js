import axios from 'axios';

// We will replace this URL after deploying the backend
const API_URL = 'http://localhost:5000'; 

const api = axios.create({
    baseURL: API_URL
});

export default api;