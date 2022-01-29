import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { ImPlus } from 'react-icons/im';
import { Row, Card, Breadcrumb, Button } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { BranchList } from 'components';
const Branch = props => {
  useEffect(() => {
    document.title = 'จัดการข้อมูลสาขา';
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
            <Breadcrumb.Item active>สาขา</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
        }}>
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <h2>รายชื่อสาขา</h2>
          </Row>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              width: '100%',
            }}
            className="mb-4">
            <Button
              variant="secondary"
              style={{
                width: 140,
                height: 40,
                borderRadius: 20,
                color: 'white',
                boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              }}
              as={Link}
              to={Routes.AddBranch.path}>
              <div>
                <ImPlus /> เพิ่มสาขา
              </div>
            </Button>
          </div>
          <BranchList />
        </Card.Body>
      </Card>
    </>
  );
};
export default Branch;
