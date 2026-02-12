import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate nếu muốn điều hướng bằng hàm
import { doctorApi } from "../api/DoctorApi";
import logoMedi from "../assets/logos/MediBookLogo.svg";
import "./HeaderDoctor.css";

const { Header } = Layout;
const { Text } = Typography;

const HeaderDoctor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook để điều hướng
  const [fullName, setFullName] = useState<string>("Bác sĩ");

  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        const userId = localStorage.getItem("doctorId");
        if (userId) {
          const data = await doctorApi.getProfile(userId);
          if (data && data.fullName) {
            setFullName(data.fullName);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy tên bác sĩ tại Header:", error);
      }
    };
    fetchDoctorName();
  }, []);

  const menuItems = [
    { key: "/doctor/dashboard", label: <Link to="/doctor/dashboard">Home</Link> },
    { key: "/doctor/appointments", label: <Link to="/doctor/appointments">Appointments</Link> },
    { key: "/doctor/request", label: <Link to="/doctor/request">Booking</Link> },
    { key: "/doctor/notification", label: <Link to="/doctor/notification">Notification</Link> },
  ];

  return (
    <Header className="header-doctor">
      {/* Logo bên trái */}
      <div className="logo-container">
        <Link to="/doctor/dashboard">
          <img src={logoMedi} alt="MediBook" />
        </Link>
      </div>

      {/* Menu ở giữa */}
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="header-menu"
      />

      {/* User Profile bên phải - Thêm onClick để điều hướng */}
      <div 
        className="user-profile-wrapper" 
        onClick={() => navigate("/doctor/profile")}
        style={{ cursor: "pointer" }} // Thêm con trỏ tay để người dùng biết có thể click
      >
        <Space size={10} align="center">
          <Avatar
            style={{ backgroundColor: "#4cc9b0" }}
            icon={<UserOutlined />}
            size={38}
          />

          <div className="user-info-text">
            <Text strong className="user-name">
              Dr. {fullName}
            </Text>
            <br /> {/* Đảm bảo role nằm dưới tên */}
            <Text className="user-role">Doctor Account</Text>
          </div>
        </Space>
      </div>
    </Header>
  );
};

export default HeaderDoctor;