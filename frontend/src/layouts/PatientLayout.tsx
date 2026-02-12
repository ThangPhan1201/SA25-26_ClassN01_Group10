import { Outlet } from 'react-router-dom';
import PatientHeader from '../components/PatientHeader';

const PatientLayout = () => {
  return (
    <div className="patient-app-layout">
      <PatientHeader />
      <main className="patient-content">
        <Outlet /> {/* Đây là nơi nội dung các trang con sẽ hiển thị */}
      </main>
    </div>
  );
};

export default PatientLayout;