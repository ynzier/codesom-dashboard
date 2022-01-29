import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Col, Breadcrumb, Button } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { BranchData } from 'components';
const GetBranch = props => {
  const [brId, setbrId] = useState();
  useEffect(() => {
    document.title = 'ข้อมูลสาขา';
    setbrId(props.match.params.brId);
  }, [brId]);

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
              <Link to={Routes.Branch.path}> สาขา</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ข้อมูลสาขา</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={10}>
          <BranchData brId={brId} />
        </Col>
      </Row>
    </>
  );
};
export default GetBranch;
