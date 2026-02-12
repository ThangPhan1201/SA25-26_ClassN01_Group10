import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials: any) => {
    return axiosClient.post('/auth/login', credentials);
  },
};