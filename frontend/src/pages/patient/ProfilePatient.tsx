import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  DatePicker,
  Select,
  Typography,
  Card,
  Spin,
  message,
} from "antd";
import {
  EditOutlined,
  LogoutOutlined,
  CheckCircleFilled,
  UserOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "../doctor/Profile.css"; // Dùng chung file CSS với Doctor để đồng bộ giao diện

const { Title, Text } = Typography;

const PatientProfile: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = "http://localhost:3000";

  // Hàm xử lý URL ảnh giống logic Doctor nhưng trỏ vào user.avatar
  const getAvatarUrl = (avatarPath: string | undefined) => {
    if (!avatarPath) return "https://www.w3schools.com/howto/img_avatar.png"; 
    if (avatarPath.startsWith("http")) return avatarPath; 
    return avatarPath.startsWith("/") ? `${API_URL}${avatarPath}` : `${API_URL}/${avatarPath}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (userId) {
          const res = await axios.get(
            `${API_URL}/api/patients/user/${userId}`,
            { headers }
          );
          // Theo cấu trúc NestJS của bạn: trả về trực tiếp object hoặc bọc trong .data
          const actualData = res.data.data ? res.data.data : res.data;
          setPatient(actualData);
        }
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
        message.error("Lỗi tải thông tin cá nhân");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Hàm cập nhật thông tin
  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // 1. Chỉ lấy những trường mà bảng Patient cho phép sửa
      // Loại bỏ 'user', 'id', 'userId', 'createdAt' để tránh lỗi ValidationPipe
      const { 
        fullName, 
        gender, 
        dateOfBirth, 
        phone, 
        address, 
        healthInsuranceNumber 
      } = patient;
  
      const updateData = { 
        fullName, 
        gender, 
        dateOfBirth, 
        phone, 
        address, 
        healthInsuranceNumber 
      };
  
      // 2. Gọi API Patch tới đúng ID của Patient
      await axios.patch(
        `${API_URL}/api/patients/${patient.id}`, 
        updateData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      message.success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err.response?.data);
      const errorMsg = err.response?.data?.message;
      message.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg || "Lỗi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: "center", padding: "100px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!patient) return <div>Không tìm thấy dữ liệu bệnh nhân.</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-header-text">
        <Title level={2}>Personal profile</Title>
        <Text type="secondary">Manage your health and personal information.</Text>
      </div>

      <div className="profile-content-layout">
        {/* LEFT CARD: Avatar & Summary */}
        <div className="profile-left-card">
          <Card className="doctor-card">
            <div className="image-wrapper">
              <img
                // QUAN TRỌNG: Lấy avatar từ patient.user.avatar theo Entity của bạn
                src={getAvatarUrl(patient?.user?.avatar)}
                alt="Patient Avatar"
                className="main-avatar"
              />
              
            </div>

            <div className="doctor-info-summary" style={{ textAlign: "center" }}>
              <Title level={4} style={{ margin: "10px 0 5px" }}>
                {patient.fullName}{" "}
                <CheckCircleFilled style={{ color: "#52c41a", fontSize: "16px" }} />
              </Title>
              <Text type="secondary">Patient ID: #{patient.id?.toString().substring(0, 8)}</Text>
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE: Form Details */}
        <div className="profile-right-form">
          <Card title={<><UserOutlined /> Detailed information</>} className="form-card">
            <div className="form-grid">
              <div className="form-row">
                <span className="label">Full name:</span>
                <Input
                  value={patient.fullName}
                  onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Phone number:</span>
                <Input
                  value={patient.phone}
                  onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Email:</span>
                <Input
                  value={patient?.user?.email}
                  disabled
                  className="custom-input readonly-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Date of Birth:</span>
                <DatePicker
                  value={patient.dateOfBirth ? dayjs(patient.dateOfBirth) : null}
                  onChange={(date) =>
                    setPatient({ ...patient, dateOfBirth: date ? date.toDate() : null })
                  }
                  format="DD - MM - YYYY"
                  style={{ width: "100%" }}
                  className="custom-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Gender:</span>
                <Select
                  value={patient.gender}
                  onChange={(value) => setPatient({ ...patient, gender: value })}
                  style={{ width: "100%" }}
                  className="custom-select"
                  options={[
                    { value: "man", label: "Male" },
                    { value: "woman", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                />
              </div>

              <div className="form-row">
                <span className="label">Address:</span>
                <Input
                  value={patient.address}
                  onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>
              
              <div className="form-row">
                <span className="label">Health Insurance Number:</span>
                <Input
                  value={patient.healthInsuranceNumber}
                  onChange={(e) => setPatient({ ...patient, healthInsuranceNumber: e.target.value })}
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>
            </div>
          </Card>

          <div
            className="profile-actions"
            style={{
              marginTop: "30px",
              display: "flex",
              gap: "15px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              icon={<LogoutOutlined />}
              className="logout-btn"
              danger
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Log out
            </Button>
            <Button
              type="primary"
              className="save-btn"
              style={{ background: "#53CCAB", border: "none" }}
              onClick={handleSave}
            >
              Save Change
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;