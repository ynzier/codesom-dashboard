import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Breadcrumb } from 'react-bootstrap';
import { ProductEdit } from 'components';
const GetProduct = () => {
  let { productId } = useParams();

  useEffect(() => {
    document.title = 'ข้อมูลสินค้า';
  }, [productId]);

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
            <Breadcrumb.Item href={Routes.ProductList.path}>
              สินค้า
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ข้อมูลสินค้า</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <ProductEdit productId={productId} />
      </Row>
    </>
  );
};
export default GetProduct;
