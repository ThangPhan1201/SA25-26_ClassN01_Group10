import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Search, User, Download } from "lucide-react";
import "./History.css";

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loggedInDoctorId = localStorage.getItem("doctorId");
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [resAppt, resRecords, resDoctor] = await Promise.all([
          axios.get("http://localhost:3000/api/appointments", config),
          axios.get("http://localhost:3000/api/medical-records", config),
          // 2. Thêm API lấy thông tin bác sĩ giống Appointment
          axios.get(
            `http://localhost:3000/api/doctors/${loggedInDoctorId}`,
            config
          ),
        ]);

        setDoctor(resDoctor.data);

        if (resAppt.data && resRecords.data) {
          const myHistoryApts = resAppt.data.filter((apt: any) => {
            const isMyAppointment =
              String(apt.doctor?.userId || apt.doctorId) ===
              String(loggedInDoctorId);
            const isCompleted = apt.status?.toLowerCase() === "completed";
            return isMyAppointment && isCompleted;
          });

          const mergedData = myHistoryApts.map((apt: any) => {
            const record = resRecords.data.find(
              (rec: any) => String(rec.appointmentId) === String(apt.id)
            );

            return {
              ...apt,
              // Chỉ giữ lại diagnosis
              diagnosis: record ? record.diagnosis : "No diagnosis available",
            };
          });

          setAppointments(mergedData);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu lịch sử:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const dStr = selectedDate.toLocaleDateString("en-CA"); // Định dạng YYYY-MM-DD

    // 1. Lọc theo ngày và từ khóa tìm kiếm
    const filtered = appointments.filter(
      (apt: any) =>
        apt.appointment_date === dStr &&
        apt.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sắp xếp theo giờ hẹn từ sáng đến chiều
    return filtered.sort((a, b) => {
      // So sánh chuỗi thời gian "HH:mm"
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
    <div className="history-container">
      <header className="history-header">
        <div className="welcome-box">
          <h1>
            Appointment history{" "}
            <span className="highlight-green">Dr. {doctor?.fullName}</span>
          </h1>
          <p>
            Viewing medical records for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <div className="history-content">
        <aside className="history-sidebar">
          <div className="calendar-card-white">
            <Calendar
              onChange={(val: any) => setSelectedDate(val)}
              value={selectedDate}
              prev2Label={null}
              next2Label={null}
              formatMonthYear={(locale, date) =>
                date.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              }
            />
          </div>
        </aside>

        <section className="history-list-section">
          <div className="list-white-box">
            <div className="list-header">
              <h2>Examined Patients</h2>
              <div className="history-search">
                <Search size={18} color="#999" />
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <table className="history-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Appointment</th>
                  <th>Diagnosis</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div className="p-cell">
                          <div className="p-avatar-circle">
                            {apt.patient?.user?.avatar ? (
                              <img
                                src={`http://localhost:3000${apt.patient.user.avatar}`}
                                alt="avatar"
                              />
                            ) : (
                              <User size={20} color="#53CCAB" />
                            )}
                          </div>
                          <div>
                            <p className="p-name">{apt.patient?.fullName}</p>
                            <p className="p-info">
                              {apt.patient?.gender || "Patient"} - Completed
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-time">{apt.appointment_time}</td>
                      {/* ĐÃ XOÁ PHẦN SYMPTOMS Ở ĐÂY */}
                      <td className="p-diagnosis">
                        <span className="diagnosis-text">{apt.diagnosis}</span>
                      </td>
                      <td>
                        <div className="history-actions-end">
                          <button className="btn-view-records">
                            View Records
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="no-data">
                      No history records found for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="history-footer">
              <div className="pagination">
                <span className="page-nav">&lt;</span>
                <span className="active-page">1</span>
                <span className="page-nav">&gt;</span>
              </div>
              <button className="btn-export">
                <Download size={16} /> Export CSV
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppointmentHistory;
