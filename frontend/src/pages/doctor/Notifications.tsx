import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Search, MoreHorizontal } from "lucide-react";
import "./Notifications.css";

import newRequestIcon from "../../assets/icons/new_request.svg";
import cancelledRequestIcon from "../../assets/icons/cancelled_request.svg";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = "http://localhost:3000";

  const fetchData = async () => {
    try {
      const doctorId = localStorage.getItem("doctorId");
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      if (!doctorId) return;

      const [resNotifs, resDoctor] = await Promise.all([
        axios.get(`${API_URL}/api/notifications/user/${doctorId}`, { headers }),
        axios.get(`${API_URL}/api/doctors/${doctorId}`, { headers }),
      ]);

      setNotifications(resNotifs.data || []);
      setDoctor(resDoctor.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CHỨC NĂNG ĐÁNH DẤU TẤT CẢ ĐÃ ĐỌC (Dùng PATCH)
  const handleMarkAllAsRead = async () => {
    const unreadNotifs = notifications.filter((n) => !n.isRead);
    if (unreadNotifs.length === 0) return;

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Optimistic UI: Cập nhật giao diện trước để người dùng thấy thay đổi ngay
    const originalNotifs = [...notifications];
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    try {
      // Gọi API PATCH đồng thời cho tất cả các ID chưa đọc
      await Promise.all(
        unreadNotifs.map((n) =>
          axios.patch(`${API_URL}/api/notifications/${n.id}/read`, {}, { headers })
        )
      );
      console.log("Đã cập nhật tất cả thông báo qua PATCH");
    } catch (error) {
      console.error("Lỗi khi PATCH thông báo:", error);
      // Rollback nếu có lỗi xảy ra
      setNotifications(originalNotifs);
      alert("Không thể cập nhật trạng thái thông báo.");
    }
  };

  const filteredNotifs = useMemo(() => {
    let list = notifications;
    if (activeTab === "Unread") list = list.filter((n) => !n.isRead);
    if (searchTerm.trim() !== "") {
      list = list.filter((n) =>
        n.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return list;
  }, [notifications, activeTab, searchTerm]);

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="notif-container">
      <header className="notif-header">
        <div>
          <h1>Notification Dr. <span className="highlight-green">{doctor?.fullName || "Bác sĩ"}</span></h1>
          <p>You have {notifications.filter(n => !n.isRead).length} unread notifications.</p>
        </div>
        <button className="btn-mark-all" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </header>

      <div className="notif-card">
        <div className="notif-toolbar">
          <div className="notif-tabs">
            {["All", "Unread"].map((tab) => (
              <button
                key={tab}
                className={`tab-item ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "All" ? "All" : "Unread"}
              </button>
            ))}
          </div>
        </div>

        {/* List với Padding và Gap để không bị dính cạnh */}
        <div className="notif-list" style={{ padding: '10px 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((n) => {
              const isCancelled = n.content?.toLowerCase().includes("cancelled") || n.type === "cancel";
              const isUnread = !n.isRead;

              return (
                <div key={n.id} className={`notif-row ${isUnread ? "unread-row" : ""}`}>
                  <div className="notif-left">
                    <div className={`notif-icon-box ${isCancelled ? "bg-rose-light" : "bg-mint-light"}`}>
                      <img src={isCancelled ? cancelledRequestIcon : newRequestIcon} alt="icon" className="notif-svg-icon" />
                    </div>
                    <div className="notif-content">
                      <h4 className="notif-title" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', margin: 0, gap: '8px' }}>
                        {n.title}
                        {isUnread && (
                          <span className={`unread-dot ${isCancelled ? "dot-red" : "dot-mint"}`}></span>
                        )}
                      </h4>
                      <p className="notif-msg" style={{ margin: '4px 0' }}>{n.content}</p>
                      {n.patientName && <span className="patient-tag">Patient: {n.patientName}</span>}
                    </div>
                  </div>

                  <div className="notif-right">
                    <span className="notif-time">
                      {new Date(n.createdAt).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-notif-box">No notification.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;