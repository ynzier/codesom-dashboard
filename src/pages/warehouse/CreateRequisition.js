import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Row, Col, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import { IngrReqList } from 'components';
const IngrRequestPage = props => {
  const { selectBranch } = props;
  const [selectedBranchId, setBranchId] = useState('');
  const [reqData, setReqData] = useState([]);
  useEffect(() => {
    {
      reqData.length
        ? (document.title = 'ตรวจสอบรายการ')
        : (document.title = 'สร้างใบเบิกสินค้า');
    }
  }, []);

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
            {reqData.length > 0 ? (
              <>
                <Breadcrumb.Item>
                  <Link to={Routes.CreateRequisition.path}>
                    สร้างใบเบิกสินค้า
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item active>ตรวจสอบรายการ</Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item active>สร้างใบเบิกสินค้า</Breadcrumb.Item>
            )}
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={8}>
          <IngrReqList
            selectedBranchId={selectedBranchId}
            setBranchId={setBranchId}
            reqData={reqData}
            setReqData={setReqData}
            selectBranch={selectBranch}
          />
        </Col>
      </Row>
    </>
  );
};
export default IngrRequestPage;
