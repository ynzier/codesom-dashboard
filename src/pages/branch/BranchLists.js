import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import { Routes } from 'routes';

import { Row, Card, Breadcrumb, Col } from 'react-bootstrap';
import { BranchList } from 'components';
import { Input, Button } from 'antd';
const BranchLists = () => {
  let history = useHistory();

  useEffect(() => {
    document.title = 'รายชื่อสาขา';
  }, []);
  const [keyword, setKeyword] = useState(undefined);
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
            <Breadcrumb.Item active>รายชื่อสาขา</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <h2>รายชื่อสาขา</h2>
          </Row>
          <Row className="mb-4">
            <Col xs={8} md={6} lg={6} xl={6}>
              <Input
                onChange={e => setKeyword(e.target.value)}
                value={keyword}
                allowClear
                placeholder="ค้นหาสาขา"
              />
            </Col>
            <Col md={1} lg={2} xl={4} />
            <Col xs={4} md={5} lg={4} xl={2}>
              <Button
                type="primary"
                onClick={() => {
                  history.push(Routes.AddBranch.path);
                }}>
                เพิ่มสาขา
              </Button>
            </Col>
          </Row>
          <BranchList keyword={keyword} />
        </Card.Body>
      </Card>
    </>
  );
};
export default BranchLists;
