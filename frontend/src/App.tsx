import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DoctorLayout from './layouts/DoctorLayout';
import Dashboard from './pages/doctor/Dashboard';
import Appointments from './pages/doctor/Appointments';
import Request from './pages/doctor/Request';
import AppointmentHistory from './pages/doctor/History';
import Notifications from './pages/doctor/Notifications';
import DoctorProfile from './pages/doctor/Profile';
import PatientAppointment from "./pages/patient/PatientAppointment";
import ProfilePatient from './pages/patient/ProfilePatient';
import SignUp from './pages/SignUp';

// IMPORT CHO PATIENT
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientNotification from './pages/patient/PatientNotification';
import PatientLayout from './layouts/PatientLayout';
// Giả sử sau này bạn tạo thêm:
// import PatientAppointments from './pages/patient/PatientAppointments';

function App() {
  return (
    <Routes>
      {/* 1. ĐIỀU HƯỚNG MẶC ĐỊNH */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 2. TRANG LOGIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />

      {/* 3. NHÓM TRANG DOCTOR (Màu xanh Mint) */}
      <Route path="/doctor" element={<DoctorLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="request" element={<Request />} />
        <Route path="history" element={<AppointmentHistory />} />
        <Route path="notification" element={<Notifications />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* 4. NHÓM TRANG PATIENT (Màu xanh Blue) */}
      {/* Nếu bạn chưa tạo PatientLayout, bạn có thể gọi trực tiếp Dashboard có chứa Header */}
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointment />} />
        <Route path="/patient/notifications" element={<PatientNotification />} />
        <Route path="profile" element={<ProfilePatient />} />
        
        {/* Sau này thêm các trang con cho Patient tại đây:
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="notifications" element={<PatientNotifications />} />
        <Route path="profile" element={<PatientProfile />} /> 
        */}
      </Route>

      {/* 5. TRANG 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;