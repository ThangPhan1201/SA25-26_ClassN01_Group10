import axiosClient from './axiosClient';

export interface Doctor {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    experienceYear: number;
    description: string;
    address: string;
    patientsSeen: number;
    dateOfBirth: string;
    createdAt: string;
    department?: {
      id: string;
      name: string;
      description: string;
    };
    user?: {
      email: string;
      username: string;
    };
  }

export const doctorApi = {
  getProfile: (id: string): Promise<Doctor> => {
    return axiosClient.get(`/doctors/${id}`);
  },
};