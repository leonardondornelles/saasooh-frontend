import axios from "axios";
import Cookies from 'js-cookie';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('saas_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
})