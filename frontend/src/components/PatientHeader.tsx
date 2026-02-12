import React, { useEffect, useState } from "react";
import { Layout, Menu, Avatar, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logoMedi from "../assets/logos/MediBookLogo.svg";
import "./PatientHeader.css";

const { Header } = Layout;
const { Text } = Typography;

const PatientHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("Bệnh nhân");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (userId) {
          const res = await axios.get(
            `http://localhost:3000/api/patients/user/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.data) {
            setFullName(res.data.fullName);
            setAvatar(res.data.avatar);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin bệnh nhân:", error);
      }
    };
    fetchPatientProfile();
  }, []);

  // Đã loại bỏ thuộc tính 'icon' ở đây
  const menuItems = [
    {
      key: "/patient/dashboard",
      label: <Link to="/patient/dashboard">Home</Link>,
    },
    {
      key: "/patient/appointments",
      label: <Link to="/patient/appointments">Appointments</Link>,
    },
    {
      key: "/patient/notifications",
      label: <Link to="/patient/notifications">Notification</Link>,
    },
  ];

  return (
    <Header className="header-doctor">
      {" "}
      {/* Kế thừa class header-doctor để đồng bộ 100% layout */}
      <div className="logo-container">
        <Link to="/patient/dashboard">
          <img src={logoMedi} alt="MediBook" />
        </Link>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="header-menu"
      />
      <div
        className="user-profile-wrapper"
        onClick={() => navigate("/patient/profile")}
      >
        <Space size={10} align="center">
          <Avatar
            style={{ backgroundColor: "#4cc9b0" }} // Màu xanh Mint đồng bộ với Doctor
            icon={<UserOutlined />}
            src={avatar}
            size={38}
          />
          <div className="user-info-text">
            <Text strong className="user-name">
              {fullName}
            </Text>
            <Text
              className="user-role"
              style={{
                display: "block",
                marginTop: "-2px", // Đây là khoảng cách bạn muốn thêm (tăng/giảm tùy ý)
                fontSize: "12px",
              }}
            >
              Patient Account
            </Text>
          </div>
        </Space>
      </div>
    </Header>
  );
};

export default PatientHeader;
