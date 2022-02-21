import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Row, Card, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';

const Home = ({ generate }) => {
  useEffect(() => {
    document.title = 'Admin Dashboard / ข้อมูลผู้ดูแล';
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item active>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card>
        <Card.Header>
          <div className="table-settings mb-4">
            <Row className="justify-content-between align-items-center">
              Dashboard
            </Row>
          </div>
        </Card.Header>
      </Card>
    </>
  );
};
export default Home;
