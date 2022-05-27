import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Container } from 'react-bootstrap';
import { Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import { Routes } from 'routes';
import NotFoundImage from 'assets/img/illustrations/404.svg';

const NotFound = () => {
  let history = useHistory();
  return (
    <Container>
      <Row>
        <Col
          xs={12}
          className="text-center d-flex align-items-center justify-content-center mt-7">
          <div>
            <Card.Link as={Link} to={Routes.Home.path}>
              <Image src={NotFoundImage} className="img-fluid w-75" />
            </Card.Link>
            <h1 className="mt-5" style={{ color: '#97515f' }}>
              Page not <span className="fw-bolder">found</span>
            </h1>
            <p className="lead my-4">
              เหมือนว่าระบบไม่พบหน้าที่ต้องการ! ลองตรวจสอบลิงค์อีกครั้ง
            </p>
            <Button
              type="primary"
              style={{ width: 140, alignItems: 'center' }}
              onClick={() => {
                history.push('/');
              }}>
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="animate-left-3 me-2 "
              />
              ย้อนกลับ
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default NotFound;
