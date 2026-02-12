import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  X,
  Plus,
  Trash2,
  Pill,
  CheckCircle,
  Download,
  User,
  Search,
} from "lucide-react";
import "./MedicalExam.css";

interface Props {
  appointment: any;
  onClose: (isUpdated?: boolean) => void;
}

const MedicalExamModal: React.FC<Props> = ({ appointment, onClose }) => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [showMedList, setShowMedList] = useState(false);
  const [medSearchTerm, setMedSearchTerm] = useState("");

  const [record, setRecord] = useState({
    diagnosis: "",
    conclusion: "",
  });

  const [prescriptionList, setPrescriptionList] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(res.data);
      } catch (error) {
        console.error("Không thể lấy danh sách thuốc", error);
      }
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(medSearchTerm.toLowerCase()) ||
        m.strength.toLowerCase().includes(medSearchTerm.toLowerCase())
    );
  }, [medicines, medSearchTerm]);

  const addMedicine = (med: any) => {
    console.log("Thuốc được chọn:", med);
    const actualId = med.id || med.medicine_id || med.medicineId;

    if (!actualId) {
      alert("Lỗi: Thuốc này không có ID hợp lệ!");
      return;
    }

    const exists = prescriptionList.find((p) => p.medicineId === med.id);
    if (exists) return;

    setPrescriptionList([
      ...prescriptionList,
      {
        medicine_id: actualId,
        name: med.name,
        concentration: med.concentration || "", // Lưu trữ concentration/strength
        dosage: "",
        usage: "",
      },
    ]);
    setShowMedList(false);
    setMedSearchTerm("");
  };

  const removeMedicineRow = (index: number) => {
    const newList = [...prescriptionList];
    newList.splice(index, 1);
    setPrescriptionList(newList);
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // BƯỚC 1: Tạo Medical Record
      const recordPayload = {
        appointment_id: Number(appointment.id),
        diagnosis: record.diagnosis,
        conclusion: record.conclusion,
        symptoms: appointment.symptoms || "Khám bệnh định kỳ",
      };

      const resRecord = await axios.post(
        "http://localhost:3000/api/medical-records",
        recordPayload,
        config
      );
      const newRecordId = resRecord.data.id;

      // BƯỚC 2: Tạo Prescriptions
      if (newRecordId && prescriptionList.length > 0) {
        const prescriptionPromises = prescriptionList.map((p) => {
          // PAYLOAD PHẢI KHỚP CHÍNH XÁC VỚI CreatePrescriptionDto
          const payload = {
            medical_record_id: String(newRecordId), // Phải là snake_case
            medicine_id: String(p.medicine_id), // Phải là snake_case
            medicine_name: p.concentration
              ? `${p.name} ${p.concentration}`
              : p.name,
            dosage: String(p.dosage || "1 đơn vị"),
            usage: String(p.usage || "Uống theo chỉ định"),
          };

          console.log("Gửi đơn thuốc tới API:", payload);
          return axios.post(
            "http://localhost:3000/api/prescriptions",
            payload,
            config
          );
        });

        await Promise.all(prescriptionPromises);
      }

      alert("Hoàn thành và lưu đơn thuốc thành công!");
      onClose(true);
    } catch (error: any) {
      console.error("Lỗi Network:", error.response?.data || error.message);
      const serverMsg = error.response?.data?.message;
      // Hiển thị lỗi chi tiết từ ValidationPipe để bác sĩ biết trường nào sai
      alert(
        "Lỗi: " +
          (Array.isArray(serverMsg)
            ? serverMsg.join(", ")
            : serverMsg || "Không thể lưu đơn thuốc")
      );
    }
  };

  return (
    <div className="exam-overlay">
      <div className="exam-card">
        <div className="exam-header">
          <h2 className="main-title">Medical Examination</h2>
          <button className="btn-close-transparent" onClick={() => onClose()}>
            <X size={24} />
          </button>
        </div>

        <div className="exam-body">
          {/* PATIENT INFO SECTION */}
          <div className="patient-summary-card">
            <div className="p-main-info">
              <div className="p-avatar-large">
                {appointment.patient?.user?.avatar ? (
                  <img
                    src={`http://localhost:3000${appointment.patient.user.avatar}`}
                    alt="avatar"
                  />
                ) : (
                  <User size={32} color="#28BF96" />
                )}
              </div>
              <div className="p-details">
                <h3>{appointment.patient?.fullName}</h3>
                <div className="p-grid-info">
                  <span>
                    <strong>Gender:</strong> {appointment.patient?.gender}
                  </span>
                  <span>
                    <strong>DOB:</strong>{" "}
                    {appointment.patient?.dateOfBirth || "N/A"}
                  </span>
                  <span>
                    <strong>Age:</strong> {appointment.patient?.age || "20"}{" "}
                    Years
                  </span>
                  <span>
                    <strong>Phone:</strong>{" "}
                    {appointment.patient?.phone || "N/A"}
                  </span>
                  <span>
                    <strong>Insurance:</strong>{" "}
                    {appointment.patient?.healthInsuranceNumber || "N/A"}
                  </span>
                  <span className="full-width">
                    <strong>Address:</strong>{" "}
                    {appointment.patient?.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DIAGNOSIS SECTION */}
          <div className="exam-section">
            <div className="section-title">
              <CheckCircle size={18} /> Diagnosis & Conclusion
            </div>
            <div className="diagnosis-grid">
              <textarea
                className="exam-textarea small"
                value={record.diagnosis}
                onChange={(e) =>
                  setRecord({ ...record, diagnosis: e.target.value })
                }
                placeholder="Enter diagnosis..."
              />
              <textarea
                className="exam-textarea small"
                value={record.conclusion}
                onChange={(e) =>
                  setRecord({ ...record, conclusion: e.target.value })
                }
                placeholder="Final conclusion/advice..."
              />
            </div>
          </div>

          <div className="prescription-section">
            <div className="prescription-header">
              <div className="section-title">
                <Pill size={18} /> Prescription
              </div>
              <div className="med-search-container">
                <button
                  className="btn-add-med"
                  onClick={() => setShowMedList(!showMedList)}
                >
                  <Plus size={16} /> Add Medicine
                </button>

                {showMedList && (
                  <div className="med-dropdown-card">
                    <div className="med-search-box">
                      <Search size={14} />
                      <input
                        type="text"
                        placeholder="Search medicine name..."
                        autoFocus
                        value={medSearchTerm}
                        onChange={(e) => setMedSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="med-list-items">
                      {filteredMedicines.map((m) => (
                        <div
                          key={m.id}
                          className="med-item"
                          onClick={() => addMedicine(m)}
                        >
                          {m.name} - <small>{m.concentration}</small>
                        </div>
                      ))}
                      {filteredMedicines.length === 0 && (
                        <div className="med-no-result">No medicines found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <table className="med-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Dosage</th>
                  <th>Usage</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionList.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="med-name-cell">
                        {/* CHỈNH SỬA: Hiển thị Tên thuốc - Nồng độ */}
                        <strong>
                          {item.name} - {item.concentration}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <input
                        className="table-input"
                        value={item.dosage}
                        onChange={(e) => {
                          const newList = [...prescriptionList];
                          newList[index].dosage = e.target.value;
                          setPrescriptionList(newList);
                        }}
                        placeholder="e.g. 10 pills"
                      />
                    </td>
                    <td>
                      <input
                        className="table-input"
                        value={item.usage}
                        onChange={(e) => {
                          const newList = [...prescriptionList];
                          newList[index].usage = e.target.value;
                          setPrescriptionList(newList);
                        }}
                        placeholder="e.g. 2 times/day"
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-icon-delete"
                        onClick={() => removeMedicineRow(index)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="exam-footer">
          <button className="btn-export" type="button">
            <Download size={18} /> Export PDF
          </button>
          <div className="right-btns">
            <button
              className="btn-cancel-exam"
              type="button"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              className="btn-complete-exam"
              type="button"
              onClick={handleComplete}
            >
              <CheckCircle size={18} /> Complete Examination
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalExamModal;
