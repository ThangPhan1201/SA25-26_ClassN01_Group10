import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Search, User } from "lucide-react";
import "./Appointments.css";
import MedicalExamModal from "./MedicalExamModal";
import MedicalRecordDetailModal from "./MedicalRecorđetailModal";

const DoctorAppointment: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApptForExam, setSelectedApptForExam] = useState<any>(null);
  const [selectedApptForDetails, setSelectedApptForDetails] =
    useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");

      if (doctorId) {
        const [docRes, apptRes] = await Promise.all([
          axios.get(`http://localhost:3000/api/doctors/${doctorId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDoctor(docRes.data);

        const processed = apptRes.data
          .filter((apt: any) => String(apt.doctor?.userId) === String(doctorId))
          .map((apt: any) => ({
            ...apt,
            displayStatus:
              apt.status?.toLowerCase() === "confirmed"
                ? "waiting"
                : apt.status?.toLowerCase(),
          }));
        setAppointments(processed);
      }
    } catch (error) {
      console.error("Data fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length || 0;
    const getCount = (s: string) =>
      appointments.filter((a) => a.displayStatus === s).length;

    return {
      waiting: getCount("waiting"),
      completed: getCount("completed"),
      cancelled: getCount("cancelled"),
      pending: getCount("pending"),
      total,
    };
  }, [appointments]);

  const filteredData = useMemo(() => {
    const dStr = selectedDate.toLocaleDateString("en-CA");

    const filtered = appointments.filter(
      (a) =>
        a.appointment_date === dStr &&
        a.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        a.displayStatus !== "pending"
    );

    return filtered.sort((a, b) => {
      if (a.appointment_time < b.appointment_time) return -1;
      if (a.appointment_time > b.appointment_time) return 1;
      return 0;
    });
  }, [appointments, searchTerm, selectedDate]);

  if (loading)
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="appt-container">
      {selectedApptForExam && (
        <MedicalExamModal
          appointment={selectedApptForExam}
          onClose={(upd) => {
            setSelectedApptForExam(null);
            if (upd) fetchData();
          }}
        />
      )}

      <header className="appt-header">
        <div className="welcome-box">
          <h1 className="welcome-title">
            <span className="doctor-highlight">Dr. {doctor?.fullName}'s</span>{" "}
            Appointment
          </h1>
          <p>Manage your daily patients and schedule efficiently.</p>
        </div>

        <div className="stats-gradient-main">
          <StatPill
            label="Waiting"
            value={stats.waiting}
            total={stats.total}
            type="waiting"
          />
          <div className="v-divider" />
          <StatPill
            label="Completed"
            value={stats.completed}
            total={stats.total}
            type="completed"
          />
          <div className="v-divider" />
          <StatPill
            label="Cancelled"
            value={stats.cancelled}
            total={stats.total}
            type="cancelled"
          />
          <div className="v-divider" />
          <StatPill
            label="Pending"
            value={stats.pending}
            total={stats.total}
            type="pending"
          />
        </div>
      </header>

      <div className="appt-content">
        <aside className="calendar-sidebar">
          <div className="calendar-card-gradient">
            <Calendar
              onChange={(v: any) => setSelectedDate(v)}
              value={selectedDate}
              className="custom-calendar-ui"
              locale="en-US" // ĐÃ SỬA: Chuyển lịch sang tiếng Anh
            />
          </div>
        </aside>

        <section className="main-list-card">
          <div className="list-header">
            {/* ĐÃ SỬA: Hiển thị ngày tiêu đề theo chuẩn tiếng Anh (VD: Monday, February 10, 2025) */}
            <h2>
              Schedule: {selectedDate.toLocaleDateString("en-US", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="search-wrapper">
              <Search size={18} color="#94a3b8" />
              <input
                placeholder="Search patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <table className="appt-table-modern">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div className="p-cell">
                        <div className="p-avatar-box">
                          {apt.patient?.user?.avatar ? (
                            <img
                              src={`http://localhost:3000${apt.patient.user.avatar}`}
                              alt=""
                            />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                        <div>
                          <p className="p-name">{apt.patient?.fullName}</p>
                          <p className="p-info">
                            {apt.patient?.gender} • {apt.patient?.age || 28} Years
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-time-cell">{apt.appointment_time}</td>
                    <td>
                      <span className={`status-tag ${apt.displayStatus}`}>
                        {apt.displayStatus}
                      </span>
                    </td>
                    <td>
                      <div className="p-actions">
                        {apt.displayStatus === "waiting" && (
                          <button
                            className="btn-start"
                            onClick={() => setSelectedApptForExam(apt)}
                          >
                            Start Exam
                          </button>
                        )}
                        <button
                          className="btn-view"
                          onClick={() => setSelectedApptForDetails(apt)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No appointments for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
      {selectedApptForDetails && (
        <MedicalRecordDetailModal
          appointment={selectedApptForDetails}
          onClose={() => setSelectedApptForDetails(null)}
        />
      )}
    </div>
  );
};

const StatPill = ({ label, value, total, type }: any) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="stat-pill-item">
      <span className="stat-label-text">{label}</span>
      <div className="stat-number-row">
        <span className="stat-main-val">{value}</span>
        <span className={`stat-pct-tag pct-${type}`}>{pct}%</span>
      </div>
    </div>
  );
};

export default DoctorAppointment;