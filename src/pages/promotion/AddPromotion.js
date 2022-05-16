import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Col, Breadcrumb } from 'react-bootstrap';

import { PromotionCreate } from 'components';
const AddPromotion = () => {
  useEffect(() => {
    document.title = 'เพิ่มโปรโมชัน';
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
            <Breadcrumb.Item href={Routes.PromotionList.path}>
              โปรโมชัน
            </Breadcrumb.Item>
            <Breadcrumb.Item active>เพิ่มโปรโมชัน</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <PromotionCreate />
      </Row>
    </>
  );
};
export default AddPromotion;
