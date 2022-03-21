import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { PromotionEdit } from 'components';
const GetPromotion = ({ ...props }) => {
  const [promoId, setPromoId] = useState();
  useEffect(() => {
    document.title = 'ข้อมูลสินค้า';
    console.log(props.match.params.promoId);
    setPromoId(props.match.params.promoId);
  }, [promoId]);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
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
              <Link to={Routes.ProductList.path}>รายการสินค้า</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ข้อมูลสินค้า</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <PromotionEdit promoId={promoId} />
      </Row>
    </>
  );
};
export default GetPromotion;