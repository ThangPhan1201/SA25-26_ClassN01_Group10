import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Search, User, Check, X } from "lucide-react";
import "./Request.css";

const DoctorBookingRequest: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null); // State lưu thông tin bác sĩ giống Dashboard
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");

      // 1. Lấy dữ liệu bác sĩ
      if (doctorId) {
        const docResponse = await axios.get(
          `http://localhost:3000/api/doctors/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoctor(docResponse.data);
      }

      // 2. Lấy dữ liệu danh sách yêu cầu đặt lịch (Pending)
      const apptResponse = await axios.get(
        "http://localhost:3000/api/appointments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (apptResponse.data) {
        const processed = apptResponse.data.filter((apt: any) => {
          const isMyAppointment =
            String(apt.doctor?.userId) === String(doctorId);
          const isPending = apt.status?.toLowerCase() === "pending";
          return isMyAppointment && isPending;
        });
        setAppointments(processed);
      }
    } catch (error) {
      console.error("Lỗi fetch dữ liệu booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- CHỨC NĂNG CẬP NHẬT TRẠNG THÁI (MỚI THÊM) ---
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const isConfirmed = window.confirm(
        `Are you sure you want to ${newStatus} this request?`
      );

      if (isConfirmed) {
        await axios.patch(
          `http://localhost:3000/api/appointments/${id}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData(); // Tải lại dữ liệu sau khi cập nhật thành công
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update status.");
    }
  };

  // Xử lý tên bác sĩ hiển thị
  const displayDoctorName = doctor?.full_name || doctor?.fullName || "Doctor";

  const filteredData = useMemo(() => {
    const dStr = selectedDate.toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD

    // 1. Lọc theo ngày, trạng thái 'pending' và tên bệnh nhân
    const filtered = appointments.filter(
      (apt) =>
        apt.appointment_date === dStr &&
        apt.status?.toLowerCase() === "pending" &&
        apt.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sắp xếp theo giờ hẹn (appointment_time) từ sáng đến chiều
    return filtered.sort((a, b) => {
      // So sánh chuỗi thời gian (HH:mm). Ví dụ: "08:00" < "14:30"
      if (a.appointment_time < b.appointment_time) return -1;
      if (a.appointment_time > b.appointment_time) return 1;
      return 0;
    });
  }, [appointments, selectedDate, searchTerm]);

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="booking-container">
      <header className="booking-header">
        <div className="welcome-box">
          <h1 className="welcome-heading">
            Booking Request{" "}
            <span className="highlight-text">Dr. {displayDoctorName}</span>
          </h1>
          <p>You have {appointments.length} new booking requests to review.</p>
        </div>
      </header>

      <div className="booking-content">
        <aside className="calendar-aside">
          <div className="custom-calendar-card">
            <div className="corner-decoration top-left"></div>
            <div className="corner-decoration bottom-right"></div>
            <Calendar
              onChange={(val: any) => setSelectedDate(val)}
              value={selectedDate}
              formatMonthYear={(locale, date) =>
                date.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              }
            />
          </div>
        </aside>

        {/* GIỮ NGUYÊN HOÀN TOÀN CẤU TRÚC THẺ VÀ CLASS Ở ĐÂY */}
        <section className="request-list-section">
          <div className="list-header">
            <h2>Requests for {selectedDate.toLocaleDateString("en-GB")}</h2>
            <div className="booking-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="booking-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th style={{ textAlign: "center" }}>Status Action</th>
                <th style={{ textAlign: "right" }}>More</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div className="p-cell">
                        <div className="p-avatar-wrapper">
                          {apt.patient?.user?.avatar ? (
                            <img
                              src={`http://localhost:3000${apt.patient.user.avatar}`}
                              alt="avatar"
                              className="patient-avatar-img"
                            />
                          ) : (
                            <User size={20} className="avatar-placeholder" />
                          )}
                        </div>
                        <div>
                          <p className="p-name">{apt.patient?.fullName}</p>
                          <p className="p-info">
                            {apt.patient?.gender || "N/A"} -{" "}
                            {apt.patient?.age || "20"} Years
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-time">{apt.appointment_time}</td>
                    <td>
                      <div className="status-action-btns">
                        {/* Gán onClick vào nút Confirm */}
                        <button
                          className="btn-status-confirm"
                          title="Confirm"
                          onClick={() =>
                            handleUpdateStatus(apt.id, "confirmed")
                          }
                        >
                          <Check size={16} /> Confirm
                        </button>
                        {/* Gán onClick vào nút Decline */}
                        <button
                          className="btn-status-cancelled"
                          title="Decline"
                          onClick={() =>
                            handleUpdateStatus(apt.id, "cancelled")
                          }
                        >
                          <X size={16} /> Decline
                        </button>
                      </div>
                    </td>
                    <td className="booking-actions-end">
                      <button className="btn-details-link">Details</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="no-data-white">
                    No pending requests for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default DoctorBookingRequest;
