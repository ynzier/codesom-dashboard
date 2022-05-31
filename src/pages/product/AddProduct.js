import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { ProductCreate } from 'components';
const AddBranch = () => {
  const [needProcess, setNeedProcess] = useState(false);
  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
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
            <Breadcrumb.Item href={Routes.ProductList.path}>
              รายการสินค้า
            </Breadcrumb.Item>
            <Breadcrumb.Item active>เพิ่มสินค้า</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <ProductCreate
          setNeedProcess={setNeedProcess}
          needProcess={needProcess}
        />
      </Row>
    </>
  );
};
export default AddBranch;
