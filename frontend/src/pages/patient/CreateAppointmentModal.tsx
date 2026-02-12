import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  ChevronLeft,
  Send,
  User,
  CheckCircle2,
  Loader2,
  X,
  Award,
} from "lucide-react";
import "./CreateAppointmentModal.css";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAppointmentModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [checkingSlots, setCheckingSlots] = useState(false);

  // Data State
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [busySlots, setBusySlots] = useState<string[]>([]);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [deptRes, docRes] = await Promise.all([
          axios.get(`${API_URL}/api/departments`, { headers }),
          axios.get(`${API_URL}/api/doctors/active`, { headers }),
        ]);

        setDepartments(deptRes.data);
        setAllDoctors(docRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    const fetchBusySlots = async () => {
      if (step === 4 && selectedDoctor && selectedDate) {
        try {
          setCheckingSlots(true);
          const token = localStorage.getItem("token");
          const dateStr = selectedDate.toLocaleDateString("en-CA");

          const res = await axios.get(`${API_URL}/api/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const busy = res.data
            .filter((apt: any) => {
              const isSameDoctor =
                String(apt.doctor_id || apt.doctorId) ===
                String(selectedDoctor.id);
              const isSameDate = apt.appointment_date === dateStr;
              const isActive = apt.status !== "cancelled";
              return isSameDoctor && isSameDate && isActive;
            })
            .map((apt: any) => apt.appointment_time.substring(0, 5));

          setBusySlots(busy);
        } catch (error) {
          console.error("Error checking busy slots:", error);
        } finally {
          setCheckingSlots(false);
        }
      }
    };
    fetchBusySlots();
  }, [step, selectedDoctor, selectedDate]);

  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return [];
    return allDoctors.filter(
      (doc) =>
        Number(doc.department_id || doc.department?.id) ===
        Number(selectedDeptId)
    );
  }, [allDoctors, selectedDeptId]);

  const timeSlots = useMemo(
    () => ({
      morning: ["07:00", "08:00", "09:00", "10:00", "11:00"],
      afternoon: ["13:30", "14:30", "15:30", "16:30"],
    }),
    []
  );

  const handleSendRequest = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const patientRes = await axios.get(
        `${API_URL}/api/patients/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = {
        patient_id: patientRes.data.id,
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate.toLocaleDateString("en-CA"),
        appointment_time: selectedTime,
        status: "pending",
        note: `Registered for ${selectedDoctor.department?.name || "General"} Department`,
      };

      await axios.post(`${API_URL}/api/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Appointment booked successfully!");
      onSuccess();
    } catch (error: any) {
      const msg = error.response?.data?.message;
      alert(Array.isArray(msg) ? msg.join("\n") : msg || "An error occurred.");
    }
  };

  return (
    <div className="create-appt-overlay">
      <div className="create-appt-card">
        <header className="modal-wizard-header">
          <h2>Book an Appointment</h2>
          <div className="step-indicator-bar">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`step-dot ${step >= s ? "active" : ""}`}>
                <div className="dot-inner">{s}</div>
              </div>
            ))}
          </div>
          <button className="btn-close-modal-x" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </header>

        <div className="wizard-content">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spinner" /> Loading...
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="step-container">
                  <h3>1. Select Department</h3>
                  <div className="dept-grid">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        className={`dept-item ${
                          selectedDeptId === Number(dept.id) ? "selected" : ""
                        }`}
                        onClick={() => {
                          setSelectedDeptId(Number(dept.id));
                          setStep(2);
                        }}
                      >
                        {dept.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="step-content">
                  <h3>2. Select a Doctor</h3>
                  <div className="doc-grid-v2">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doc) => {
                        const avatarPath = doc.user?.avatar || doc.avatar;
                        const avatarUrl = avatarPath
                          ? `${API_URL}/avatar/${avatarPath}`
                          : null;

                        return (
                          <div
                            key={doc.id}
                            className={`doc-card-v2 ${
                              selectedDoctor?.id === doc.id ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedDoctor(doc);
                              setStep(3);
                            }}
                          >
                            <div className="doc-avatar-container">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={doc.fullName}
                                  className="doc-img-fluid"
                                />
                              ) : (
                                <User size={24} color="#28bf96" />
                              )}
                            </div>
                            <div className="doc-details">
                              <p className="doc-name">Dr. {doc.fullName}</p>
                              <p className="doc-specialty">
                                {doc.specialty || "Department"}
                              </p>
                              <div className="doc-exp">
                                <Award size={14} />
                                <span>
                                  {doc.experience_years || 5}+ years of experience
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-data-msg">
                        No doctors found for this department.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="step-container">
                  <h3>3. Select Date</h3>
                  <div className="calendar-wizard-wrapper">
                    <Calendar
                      onChange={(d) => {
                        setSelectedDate(d as Date);
                        setStep(4);
                      }}
                      value={selectedDate}
                      minDate={new Date()}
                      locale="en-US"
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="step-container">
                  <h3 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    4. Select Time{" "}
                    {checkingSlots && <Loader2 size={16} className="spinner" />}
                  </h3>
                  <div className="time-section">
                    <div className="time-grid">
                      {[...timeSlots.morning, ...timeSlots.afternoon].map((t) => {
                        const isBusy = busySlots.some((busyTime) =>
                          busyTime.startsWith(t)
                        );
                        return (
                          <button
                            key={t}
                            disabled={isBusy}
                            className={`${selectedTime === t ? "active" : ""} ${isBusy ? "busy-btn" : ""}`}
                            onClick={() => setSelectedTime(t)}
                          >
                            {t} {isBusy ? "(Full)" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {selectedTime && (
                    <div className="appointment-summary">
                      <CheckCircle2 color="#28bf96" size={24} />
                      <div className="summary-text">
                        <strong>Dr. {selectedDoctor?.fullName}</strong>
                        <p>
                          {selectedDate.toLocaleDateString("en-US", { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })} at {selectedTime}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <footer className="wizard-footer">
          <button
            className="btn-back"
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step === 4 && (
            <button
              className="btn-send"
              disabled={!selectedTime || checkingSlots}
              onClick={handleSendRequest}
            >
              Confirm Booking <Send size={18} />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default CreateAppointmentModal;