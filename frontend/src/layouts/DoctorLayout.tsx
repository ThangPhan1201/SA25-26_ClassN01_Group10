import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderDoctor from '../components/HeaderDoctor';

const { Content } = Layout;

const DoctorLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <HeaderDoctor />
      <Content style={{ padding: '0 50px', marginTop: 20 }}>
        <div style={{ background: '#fff', minHeight: '100%' }}>
          {/* Outlet sẽ render Dashboard, Appointment, v.v. tại đây */}
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default DoctorLayout;