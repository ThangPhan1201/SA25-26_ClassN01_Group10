import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

// 1. Khởi tạo instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // Thay bằng URL Backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Ngắt kết nối sau 10 giây nếu server không phản hồi
});

// 2. Cấu hình Interceptor cho Request (Gửi đi)
// Tự động lấy Token từ LocalStorage và gắn vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Cấu hình Interceptor cho Response (Trả về)
// Xử lý dữ liệu trả về hoặc bắt lỗi tập trung (ví dụ: Token hết hạn)
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về thẳng dữ liệu (data), không cần gọi .data ở Page nữa
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Ví dụ: Nếu lỗi 401 (Hết hạn Token) thì đá ra trang Login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;