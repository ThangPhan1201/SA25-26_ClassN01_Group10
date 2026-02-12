import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Card,
  Typography,
  message,
  Steps,
  Upload, // Thêm Upload
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  UploadOutlined, // Thêm icon
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]); // Quản lý file ảnh
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSignUp = async (values: any) => {
    setLoading(true);
    try {
      // BƯỚC 1: Tạo tài khoản User
      const registerRes = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          email: values.email,
          username: values.username,
          password: values.password,
          fullName: values.fullName,
        }
      );

      const userId =
        registerRes.data.id ||
        registerRes.data.userId ||
        registerRes.data.data?.id;

      if (!userId)
        throw new Error("Không lấy được ID người dùng sau khi đăng ký");

      // BƯỚC 2: Tạo hồ sơ Patient
      await axios.post("http://localhost:3000/api/patients", {
        userId: String(userId),
        fullName: values.fullName,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        phone: values.phone,
        address: values.address,
        healthInsuranceNumber: values.healthInsuranceNumber,
      });

      // BƯỚC 3: Upload Avatar (Nếu người dùng có chọn ảnh)
      if (fileList.length > 0) {
        const formData = new FormData();
        formData.append("file", fileList[0].originFileObj); // "file" phải khớp với tên trong Backend

        await axios.post(
          `http://localhost:3000/api/users/upload-avatar/${userId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      message.success("Account registration and profile picture upload successful.!");
      navigate("/login");
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error.response?.data);
      message.error(
        error.response?.data?.message || "Registration failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Card className="signup-card shadow-lg">
        <div className="signup-header">
          <Title level={2}>Register an account</Title>
          <Text type="secondary">Join MediBook to manage your health.</Text>
        </div>

        <Steps
          current={currentStep}
          className="signup-steps"
          items={[{ title: "Account" }, { title: "Information" }]}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
          initialValues={{ gender: "man" }}
        >
          {/* STEP 0: THÔNG TIN AUTH */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <Form.Item
              name="fullName"
              label="Full name"
              rules={[{ required: true, message: "Please enter your full name." }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Alexander Racheal" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="test@gmail.com" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, min: 4 }]}
            >
              <Input prefix={<UserOutlined />} placeholder="testuser123" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, min: 6 }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="******" />
            </Form.Item>
            <Button type="primary" block onClick={() => setCurrentStep(1)}>
              Tiếp theo
            </Button>
          </div>

          {/* STEP 1: THÔNG TIN PATIENT & AVATAR */}
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            
            {/* PHẦN UPLOAD ẢNH */}
            <Form.Item label="Avatar">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false} // Chặn tự động upload của AntD
                maxCount={1}
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload an Image</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <div className="form-grid">
              <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="man">Male</Select.Option>
                  <Select.Option value="woman">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-100" format="DD/MM/YYYY" />
              </Form.Item>
            </div>
            
            <Form.Item name="phone" label="Phone number" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} placeholder="0901234567" />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input prefix={<HomeOutlined />} placeholder="123 ABC Street..." />
            </Form.Item>
            <Form.Item name="healthInsuranceNumber" label="Health Insurance Number">
              <Input prefix={<IdcardOutlined />} placeholder="BH123456789" />
            </Form.Item>

            <div className="signup-buttons">
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ background: "#4cc9b0", borderColor: "#4cc9b0" }}
              >
                Register now
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;