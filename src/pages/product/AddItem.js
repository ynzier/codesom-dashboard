import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Breadcrumb } from 'react-bootstrap';
import { ProductRegisterForm } from 'components';

const AddItem = () => {
  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item active>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href='/dashboard'>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Add Item</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row>
        <Col xs={12} xl={9}>
          <ProductRegisterForm />
        </Col>
      </Row>
    </>
  );
};
export default AddItem;
