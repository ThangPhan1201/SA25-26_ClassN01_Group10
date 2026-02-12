import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Search,
  Clock,
  User,
  X,
  Eye,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import PatientHeader from "../../components/PatientHeader";
import MedicalRecordDetailModal from "../doctor/MedicalRecorđetailModal";
import CreateAppointmentModal from "./CreateAppointmentModal";
import "./PatientAppointment.css";

const PatientAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApptForDetails, setSelectedApptForDetails] =
    useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const API_URL = "http://localhost:3000";

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      const patientRes = await axios.get(
        `${API_URL}/api/patients/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const patientId = patientRes.data.id;

      const apptRes = await axios.get(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const myAppts = apptRes.data.filter(
        (a: any) => a.patientId === patientId
      );
      setAppointments(myAppts);
    } catch (error) {
      console.error("Lỗi lấy lịch hẹn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;
    try {
      await axios.patch(
        `${API_URL}/api/appointments/${id}`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchData();
    } catch (error) {
      alert("Lỗi khi hủy lịch");
    }
  };

  // Logic lọc theo ngày, tìm kiếm và SẮP XẾP GIỜ TĂNG DẦN
  const filteredAppointments = useMemo(() => {
    const dateStr = selectedDate.toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD

    return appointments
      .filter((apt) => {
        const matchesDate = apt.appointment_date === dateStr;
        const matchesSearch =
          apt.doctor?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.note?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesDate && matchesSearch;
      })
      .sort((a, b) => {
        // Sắp xếp thời gian (Ví dụ: 08:00 sẽ đứng trước 14:00)
        const timeA = a.appointment_time || "";
        const timeB = b.appointment_time || "";
        return timeA.localeCompare(timeB);
      });
  }, [appointments, selectedDate, searchTerm]);

  return (
    <div className="patient-appt-page">

      <main className="appt-main-container">
        {/* Tiêu đề và Thanh tìm kiếm */}
        <div className="appt-header-section">
          <h1 className="welcome-title">
             <span className="highlight">My Appointments</span>
          </h1>
          <div style={{ display: "flex", gap: "15px" }}>
            <div className="search-bar-wrapper">
              <Search size={20} color="#94a3b8" />
              <input
                type="text"
                placeholder="Find a doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="btn-complete-exam"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={18} /> Schedule an appointment
            </button>
          </div>
        </div>

        {/* Layout chia 2 cột */}
        <div className="appt-content-layout">
          {/* CỘT TRÁI: CARD LỊCH */}
          <aside className="calendar-sidebar">
            <div className="calendar-card">
              <Calendar
                onChange={(val) => setSelectedDate(val as Date)}
                value={selectedDate}
                locale="en-US"
              />
            </div>

            {/* Thẻ hiển thị ngày đang chọn (Trang trí thêm) */}
            <div
              className="calendar-card"
              style={{ marginTop: "20px", padding: "15px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "var(--primary)",
                }}
              >
                <CalendarIcon size={20} />
                <strong style={{ fontSize: "14px" }}>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </strong>
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: CARD DANH SÁCH */}
          <section className="appt-list-section">
            <div className="table-container">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>TIME</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: "center" }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="no-data">
                        LOADING...
                      </td>
                    </tr>
                  ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id}>
                        <td>
                          <div className="p-cell">
                            <div className="p-avatar-wrapper">
                              {apt.doctor?.user?.avatar ? (
                                <img
                                  src={`${API_URL}/avatar/${apt.doctor.user.avatar}`}
                                  alt="Avatar"
                                />
                              ) : (
                                <User size={20} color="#cbd5e1" />
                              )}
                            </div>
                            <div>
                              <p className="p-name">
                                Dr. {apt.doctor?.fullName}
                              </p>
                              <p className="p-info">{apt.doctor?.specialty}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="time-cell">
                            <Clock size={16} />{" "}
                            {apt.appointment_time?.substring(0, 5)}
                          </div>
                        </td>
                        <td>
                          <span className={`status-pill ${apt.status}`}>
                            {apt.status === "pending"
                              ? "Pending"
                              : apt.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            <button
                              className="btn-details"
                              onClick={() => setSelectedApptForDetails(apt)}
                            >
                              <Eye size={14} /> Details
                            </button>
                            {apt.status === "pending" && (
                              <button
                                className="btn-cancel"
                                onClick={() => handleCancel(apt.id)}
                              >
                                <X size={14} /> Cancelled
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="no-data">
                      There are no appointments available for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* MODALS */}
      {showCreateModal && (
        <CreateAppointmentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchData();
          }}
        />
      )}

      {selectedApptForDetails && (
        <MedicalRecordDetailModal
          appointment={selectedApptForDetails}
          onClose={() => setSelectedApptForDetails(null)}
        />
      )}
    </div>
  );
};

export default PatientAppointment;
