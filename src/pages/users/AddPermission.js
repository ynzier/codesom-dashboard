import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { UserCreateForm } from 'components';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';

const AddPermission = () => {
  useEffect(() => {
    document.title = 'เพิ่มสิทธิ์ผู้ใช้งาน';
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
        <div className="d-block mb-4 mb-md-0 ">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item>
              <Link to={Routes.Home.path}>
                <FontAwesomeIcon icon={faHome} />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={Routes.UserList.path}>ผู้ใช้งาน</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>เพิ่มสิทธิ์ผู้ใช้งาน</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <UserCreateForm />
        </Col>
      </Row>
    </>
  );
};
export default AddPermission;
