import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Pill,
  Download,
  FileText,
} from "lucide-react";

interface Props {
  appointment: any;
  onClose: () => void;
}

const MedicalRecordDetailModal: React.FC<Props> = ({
  appointment,
  onClose,
}) => {
  const [record, setRecord] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // PHÒNG VỆ CẤP 1: Nếu không có appointment, không render gì cả để tránh crash
  if (!appointment) return null;

  useEffect(() => {
    let isMounted = true; // Chống lỗi memory leak khi unmount nhanh

    const fetchFullData = async () => {
      if (!appointment?.id) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Lấy tất cả bệnh án
        const resRecords = await axios.get(
          `http://localhost:3000/api/medical-records`,
          config
        );

        if (!isMounted) return;

        // PHÒNG VỆ CẤP 2: Kiểm tra dữ liệu mảng trước khi find
        const data = Array.isArray(resRecords.data) ? resRecords.data : [];
        const foundRecord = data.find(
          (r: any) =>
            Number(r?.appointmentId) === Number(appointment.id) ||
            Number(r?.appointment_id) === Number(appointment.id)
        );

        if (foundRecord) {
          setRecord(foundRecord);

          const resPrescriptions = await axios.get(
            `http://localhost:3000/api/prescriptions/record/${foundRecord.id}`,
            config
          );
          
          if (isMounted) {
            setPrescriptions(Array.isArray(resPrescriptions.data) ? resPrescriptions.data : []);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bệnh án:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullData();
    return () => { isMounted = false; };
  }, [appointment?.id]);

  if (loading)
    return (
      <div className="exam-overlay">
        <div className="exam-card flex items-center justify-center min-h-[300px]">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  return (
    <div className="exam-overlay">
      <div className="exam-card">
        <header className="exam-header">
          <div className="header-left">
            <h2 className="main-title">Medical record details</h2>
            <p className="sub-info">
              Patient: {appointment?.patient?.fullName || "N/A"} | ID: #
              {appointment?.patientId || appointment?.id || "N/A"}
            </p>
          </div>
          <button className="btn-close" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </header>

        <div className="exam-body">
          <div className="exam-section">
            <h3>
              <FileText size={18} /> Diagnostic results
            </h3>
            <div className="input-group">
              <label>Diagnosing the disease</label>
              <div className="readonly-box">{record?.diagnosis || "N/A"}</div>
            </div>
            <div className="input-group">
              <label>Conclusion and Advice</label>
              <div className="readonly-box">
                {record?.conclusion || "No conclusion has been reached yet."}
              </div>
            </div>
          </div>

          <div className="exam-section">
            <h3>
              <Pill size={18} /> Prescription already issued
            </h3>
            <div className="overflow-x-auto">
              <table className="med-table w-full">
                <thead>
                  <tr>
                    <th>Drug name</th>
                    <th>Dosage</th>
                    <th>Usage</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length > 0 ? (
                    prescriptions.map((item, index) => (
                      <tr key={`med-${index}`}>
                        <td style={{ fontWeight: 700, color: "#28BF96" }}>
                          {item?.medicine_name || item?.medicine?.name || "N/A"}
                          {item?.medicine?.concentration ? ` (${item.medicine.concentration})` : ""}
                        </td>
                        <td>{item?.dosage || "N/A"}</td>
                        <td>{item?.usage || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="med-no-result text-center py-4">
                        There are no medications on the prescription.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="exam-footer">
          <button className="btn-export">
            <Download size={18} /> Export to PDF
          </button>
          <button className="btn-cancel-exam" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordDetailModal;