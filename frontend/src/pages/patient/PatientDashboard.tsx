import React from "react";
import PatientHeader from "../../components/PatientHeader";
import "./PatientDashboard.css";
import docBanner from "../../assets/images/doctor-banner-home.png";

const PatientDashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      
      {/* Container bao quanh để tạo khoảng cách với Header */}
      <main className="dashboard-main-container">
        
        {/* CHIẾC CARD NỔI TÁCH BIỆT VỚI NỀN */}
        <div className="dashboard-card">
          <section className="hero-banner">
            <div className="hero-left">
              <h2 className="hero-subtitle">Get Quick</h2>
              <h1 className="hero-title">Medical Services</h1>
              <p className="hero-description">
                Lorem ipsum is simply dummy text of the printing been industry's
                standard dummy text ever unknown to printer galley of type a make a
                type specimen book. It has survived not only five centuries leptorem
                ipsum dolor sit amet, consectetuer adipiscing elit
              </p>
              <button className="btn-get-services">Get Services</button>
            </div>

            <div className="hero-right">
              {/* Vòng tròn xanh Mint */}
              <div className="circle-bg"></div>
              
              {/* Ảnh bác sĩ */}
              <img src={docBanner} alt="Doctor" className="doctor-img" />

              {/* Thẻ 1520+ */}
              <div className="stat-card clients-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28BF96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div className="stat-info">
                  <h3>1520+</h3>
                  <p>Activate Clients</p>
                </div>
              </div>

              {/* Thẻ ưu đãi */}
              <div className="stat-card promo-card">
                <ul>
                  <li><span>✓</span> Get 20% off on every 1st month</li>
                  <li><span>✓</span> Expert Doctors</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
};

export default PatientDashboard;