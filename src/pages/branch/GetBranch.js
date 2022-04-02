import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Routes } from 'routes';
import { useParams } from 'react-router-dom';

import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { BranchEdit } from 'components';
const GetBranch = ({ ...props }) => {
  const { brId } = useParams();
  useEffect(() => {
    document.title = 'ข้อมูลสาขา';
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item href={Routes.Home.path}>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href={Routes.BranchLists.path}>
              สาขา
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ข้อมูลสาขา</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <BranchEdit brId={brId} />
        </Col>
      </Row>
    </>
  );
};
export default GetBranch;
