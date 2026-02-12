import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import bộ điều hướng
import App from './App.tsx';
import './index.css'; // File CSS tổng của toàn dự án

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter phải bao bọc toàn bộ App để các Route hoạt động */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);