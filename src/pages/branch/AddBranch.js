import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { ImPlus } from 'react-icons/im';
import { Row, Col, Breadcrumb, Button } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { BranchCreate } from 'components';
const AddBranch = props => {
  useEffect(() => {
    document.title = 'เพิ่มข้อมูลสาขา';
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item>
              <Link to={Routes.Home.path}>
                <FontAwesomeIcon icon={faHome} />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={Routes.BranchLists.path}> สาขา</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>เพิ่มสาขา</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <BranchCreate />
        </Col>
      </Row>
    </>
  );
};
export default AddBranch;
