import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { EmployeeEdit } from 'components';
import { Routes } from 'routes';
import { Link } from 'react-router-dom';
const GetEmployee = props => {
  const [empId, setEmpId] = useState();
  useEffect(() => {
    document.title = 'ข้อมูลพนักงาน';
    setEmpId(props.match.params.empId);
  }, [empId]);
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
              <Link to={Routes.EmployeeList.path}>พนักงาน</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ข้อมูลพนักงาน</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <EmployeeEdit empId={empId} />
        </Col>
      </Row>
    </>
  );
};
export default GetEmployee;
