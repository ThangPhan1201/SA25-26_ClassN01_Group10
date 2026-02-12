import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  DatePicker,
  Select,
  Space,
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
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./Profile.css";

const { Title, Text } = Typography;

const DoctorProfile: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const doctorId = localStorage.getItem("doctorId");
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        if (doctorId) {
          const res = await axios.get(
            `http://localhost:3000/api/doctors/${doctorId}`,
            { headers }
          );
          // Kiểm tra xem dữ liệu có nằm trong bọc res.data.data không
          const actualData = res.data.data ? res.data.data : res.data;
          setDoctor(actualData);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const doctorId = localStorage.getItem("doctorId");

      // Tạo object sạch để gửi lên Backend
      const updateData = {
        fullName: doctor.fullName,
        gender: doctor.gender,
        dateOfBirth: doctor.dateOfBirth,
        phone: doctor.phone, // Đảm bảo trong state doctor có phone
        address: doctor.address,
        description: doctor.description,
        // Chuyển đổi năm kinh nghiệm về dạng số nguyên (bỏ chữ " Years")
        experienceYear: Number(
          String(doctor.experienceYear).replace(/\D/g, "")
        ),
      };

      await axios.patch(
        `http://localhost:3000/api/doctors/${doctorId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err.response?.data);
      const errorMsg = err.response?.data?.message;
      message.error(
        Array.isArray(errorMsg)
          ? errorMsg[0]
          : errorMsg || "Không thể lưu thay đổi"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  if (!doctor) return <div>Không tìm thấy dữ liệu bác sĩ.</div>;

  // XỬ LÝ ĐƯỜNG DẪN ẢNH CẨN THẬN
  // Nếu doctor.user.avatar là "doctor_7.jpg" -> link sẽ là http://localhost:3000/avatar/doctor_7.jpg
  // Nếu doctor.user.avatar là "/avatar/doctor_7.jpg" -> link sẽ bị thừa một chữ /avatar
  const avatarName = doctor.user?.avatar;
  const avatarUrl = avatarName
    ? avatarName.startsWith("http")
      ? avatarName
      : `http://localhost:3000/avatar/${avatarName.replace(/^\/avatar\//, "")}`
    : "https://via.placeholder.com/400x500?text=No+Avatar";

  return (
    <div className="profile-page-container">
      <div className="profile-header-text">
        <Title level={2}>Personal details</Title>
        <Text type="secondary">
        Manage your personal information.
        </Text>
      </div>

      <div className="profile-content-layout">
        <div className="profile-left-card">
          <Card className="doctor-card" bordered={false}>
            <div className="image-wrapper">
              <img
                src={avatarUrl}
                alt="Doctor"
                className="main-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/400x500?text=Error+Image";
                }}
              />
            </div>
            <div className="doctor-info-summary">
              <Title level={4}>
                Dr. {doctor.fullName}{" "}
                <CheckCircleFilled style={{ color: "#4cc9b0" }} />
              </Title>
              <Text className="dept-tag">
                {doctor.department?.name?.toUpperCase() || "N/A"}
              </Text>
              <p className="specialist-desc">{doctor.description}</p>
            </div>
            <div className="stats-footer">
              <Space>
                <UserOutlined /> 312 Patients
              </Space>
              <Space>
                <StarFilled style={{ color: "#fadb14" }} /> 5.0
              </Space>
            </div>
          </Card>
        </div>

        <div className="profile-right-form">
          <Card className="form-card" bordered={false}>
            <div className="form-grid">
              <div className="form-row">
                <span className="label">Full name:</span>
                <Input
                  value={doctor.fullName}
                  onChange={(e) =>
                    setDoctor({ ...doctor, fullName: e.target.value })
                  }
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Department:</span>
                <Input
                  value={doctor.department?.name}
                  disabled
                  className="custom-input readonly-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Gender:</span>
                <Select
                  value={doctor.gender?.toLowerCase() || "other"}
                  className="custom-select"
                  onChange={(val) => setDoctor({ ...doctor, gender: val })}
                >
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </div>

              <div className="form-row">
                <span className="label">Location:</span>
                <Input
                  value={doctor.address}
                  onChange={(e) =>
                    setDoctor({ ...doctor, address: e.target.value })
                  }
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Email:</span>
                <Input
                  value={doctor.user?.email}
                  disabled
                  className="custom-input readonly-input"
                />
              </div>

              <div className="form-row">
                <span className="label">Date of birth:</span>
                <DatePicker
                  value={doctor.dateOfBirth ? dayjs(doctor.dateOfBirth) : null}
                  onChange={(date) =>
                    setDoctor({
                      ...doctor,
                      dateOfBirth: date?.format("YYYY-MM-DD"),
                    })
                  }
                  format="DD - MM - YYYY"
                  className="custom-input w-100"
                />
              </div>

              <div className="form-row">
                <span className="label">Years of experience:</span>
                <Input
                  value={`${doctor.experienceYear} Years`}
                  onChange={(e) =>
                    setDoctor({
                      ...doctor,
                      experienceYear: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  suffix={<EditOutlined className="edit-pen" />}
                  className="custom-input"
                />
              </div>
            </div>
          </Card>

          <div className="profile-actions">
            <Button
              icon={<LogoutOutlined />}
              className="logout-btn"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
            <Button
              type="primary"
              className="save-btn"
              onClick={handleSave} // Gắn hàm lưu
              loading={saving} // Hiển thị loading khi đang lưu
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
