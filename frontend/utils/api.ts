import axios from 'axios';
import { getToken } from './auth';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8080'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  profile_picture: string;
}

export interface MessageRequest {
  content: string;
}

export interface Message {
  id: number;
  user_id: number;
  username: string;
  profile_picture: string;
  content: string;
  timestamp: string;
}

export const authAPI = {
  login: (data: LoginRequest) => api.post('/login', data),
  register: (data: RegisterRequest) => api.post('/register', data),
};

export const messageAPI = {
  getMessages: () => api.get<Message[]>('/messages'),
  sendMessage: (data: MessageRequest) => api.post<Message>('/messages', data),
};

export default api;