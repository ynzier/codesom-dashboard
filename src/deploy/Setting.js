import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb, Card } from 'react-bootstrap';
import { SettingForm } from 'components/forms/SettingForm';

const App = () => {
  useEffect(() => {
    document.title = 'ตั้งค่าระบบ';
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item active>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/dashboard">Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Setting</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <Col xs={12} xl={9}>
          <Card border="light" className="shadow-sm">
            <Card.Body
              className="pt-0"
              style={{ marginTop: 30, height: '100%', width: '100%' }}>
              <SettingForm />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default App;
