import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { CreateEmployeeForm } from 'components';

const AddAdmin = () => {
  useEffect(() => {
    document.title = 'เพิ่มข้อมูลพนักงาน / Add New Employee';
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-2">
        <div className="d-block mb-4 mb-md-0 ">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item active>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/dashboard">แดชบอร์ด</Breadcrumb.Item>
            <Breadcrumb.Item active>เพิ่มข้อมูลพนักงาน</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <CreateEmployeeForm />
        </Col>
      </Row>
    </>
  );
};
export default AddAdmin;
