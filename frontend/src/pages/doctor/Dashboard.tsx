import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import "./Dashboard.css";

// Import icons
import heartIcon from "../../assets/icons/heart_doctor.svg";
import kitIcon from "../../assets/icons/first_aid_kit_doctor.svg";
import breatheIcon from "../../assets/icons/breathe_doctor.svg";
import appointIcon from "../../assets/icons/appointment_doctor.svg";
import oclockIcon from "../../assets/icons/oclock_doctor.svg";

const DoctorDashboard: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // 2. Khởi tạo hàm navigate

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const doctorId = localStorage.getItem("doctorId");
        const token = localStorage.getItem("token");
        if (doctorId) {
          const response = await axios.get(`http://localhost:3000/api/doctors/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setDoctor(response.data);
        }
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  if (loading) return <div className="loading-screen">Đang tải dữ liệu...</div>;

  const displayDoctor = {
    full_name: doctor?.full_name || doctor?.fullName || "No Find",
    department: doctor?.department?.name_department || "KHOA NỘI TỔNG QUÁT",
    description: doctor?.description || "CHUYÊN GIA PHẪU THUẬT CHỈNH HÌNH VỚI 10 NĂM KINH NGHIỆM",
    phone: doctor?.phone || "0977-958-514",
    avatar: doctor?.user?.avatar || "doctor_7.jpg",
  };

  return (
    <div className="dashboard-wrapper">
      <div className="main-portal-card">
        {/* TOP SECTION */}
        <div className="upper-layout">
          <div className="text-header">
            <h1 className="welcome-heading">
              Welcome <span className="highlight-green">Dr. {displayDoctor.full_name}</span> 👋
            </h1>
            <h2 className="dept-heading">{displayDoctor.department}</h2>
            <p className="desc-subtext">{displayDoctor.description}</p>

            <div className="status-icons">
              {[heartIcon, kitIcon, breatheIcon].map((icon, i) => (
                <div key={i} className="icon-circle-box">
                  <img src={icon} alt="status-icon" />
                </div>
              ))}
            </div>
          </div>

          <div className="avatar-portal">
            <div className="avatar-skew-shadow"></div>
            <img
              src={`http://localhost:3000/avatar/${displayDoctor.avatar}`}
              alt="Doctor Profile"
              className="portal-img"
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x800?text=No+Image")}
            />
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="stats-row-container">
          <div className="stat-rect side-rect">
            <span className="phone-display">{displayDoctor.phone}</span>
            <h3 className="rect-title">EMERGENCY SERVICE</h3>
            <p className="rect-p">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <button className="rect-btn">See More</button>
          </div>

          <div className="stat-rect center-rect center-tall">
            <img src={appointIcon} className="rect-icon" alt="apt" />
            <h3 className="rect-title">YOU HAVE 34 APPOINTMENT TODAY</h3>
            <p className="rect-p">Duis aute irure dolor in reprehenderit in voluptate.</p>
            {/* 3. Thêm sự kiện onClick để chuyển trang */}
            <button 
              className="rect-btn" 
              onClick={() => navigate("/doctor/appointments")}
            >
              Get examined
            </button>
          </div>

          <div className="stat-rect side-rect">
            <img src={oclockIcon} className="rect-icon" alt="time" />
            <h3 className="rect-title">OPENING HOURS</h3>
            <p className="rect-p">Monday - Friday<br />07:00 AM - 17:30 PM</p>
            <button className="rect-btn">See More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;