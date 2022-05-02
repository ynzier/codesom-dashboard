import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import { faHome, faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import requisitionService from 'services/requisition.service';
import { Routes } from 'routes';
import { Preloader } from 'components';
import { Table, Steps, Button } from 'antd';
import { Card, Col, Row, Breadcrumb } from 'react-bootstrap';
import { useAlert } from 'react-alert';

const GetRequisition = ({ ...props }) => {
  const { Step } = Steps;
  const alert = useAlert();
  const { reqId } = useParams();

  const { promiseInProgress } = usePromiseTracker({ area: 'getReqDetailById' });
  const customDot = dot => <span>{dot}</span>;
  const [requisitData, setRequisitData] = useState({});
  const [productList, setProductList] = useState([]);
  const [ingrList, setIngrList] = useState([]);
  const [stuffList, setStuffList] = useState([]);

  const updateStatus = status => {
    requisitionService
      .updateReqStatus(status, reqId)
      .then(response => {
        fetchReqDetail();
        alert.show(response.data.message, { type: 'success' });
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert.show(resMessage, { type: 'error' });
      });
  };

  const fetchReqDetail = () => {
    requisitionService
      .getReqDetailById(reqId)
      .then(res => {
        setRequisitData(res.data.requisitionData);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert.show(resMessage, { type: 'error' });
      });
  };

  useEffect(() => {
    document.title = 'ข้อมูลสินค้า';
    if (reqId) {
      trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchReqDetail());
            resolve(
              requisitionService
                .getReqItemsById(reqId)
                .then(res => {
                  setProductList(res.data.productArray);
                  setIngrList(res.data.ingrArray);
                  setStuffList(res.data.stuffArray);
                })
                .catch(error => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  alert.show(resMessage, { type: 'error' });
                }),
            );
          }, 2000);
        }),
        'getReqDetailById',
      );
    }

    return () => {
      setRequisitData([]);
      setProductList([]);
      setIngrList([]);
      setStuffList([]);
    };
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
            <Breadcrumb.Item>
              <Link to={Routes.RequisitionList.path}>
                ประวัติการเบิกจ่ายสินค้า
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>ใบเบิกจ่ายคลังสินค้า</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="d-flex flex-wrap flex-md-nowrap ">
        <div style={{ flex: 3, marginRight: 40 }}>
          <Card
            border="light"
            className="bg-white px-6 py-4 mb-4"
            style={{
              borderRadius: '36px',
              boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              fontFamily: 'Prompt',
              minHeight: 828,
            }}>
            {!promiseInProgress ? (
              <>
                <Card.Body>
                  <h5>สินค้า</h5>
                  {productList.length > 0 ? (
                    <Table
                      dataSource={productList}
                      columns={[
                        {
                          title: '#',
                          dataIndex: 'key',
                          align: 'center',
                          width: 60,
                          render: (text, record, index) => {
                            return (
                              <div style={{ display: 'flex' }}>
                                <span style={{ flex: 1 }}>{index + 1}</span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'ID',
                          dataIndex: 'prodId',
                          align: 'center',
                          width: 150,
                          render: (text, record, index) => {
                            return (
                              <div style={{ display: 'flex' }}>
                                <span style={{ flex: 1 }}>{text}</span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'รายการ',
                          dataIndex: 'productName',
                          align: 'center',
                          width: 260,
                          render: (text, record) => {
                            return <span>{text}</span>;
                          },
                        },
                        {
                          title: 'จำนวน',
                          dataIndex: 'quantity',
                          align: 'center',
                          width: 200,
                          render: (text, record) => (
                            <span>
                              {text} {record.productUnit}
                            </span>
                          ),
                        },
                      ]}
                      rowKey="prodId"
                      pagination={false}
                    />
                  ) : (
                    'ไม่มีรายการ'
                  )}
                  <h5 style={{ marginTop: 20 }}>วัตถุดิบ</h5>{' '}
                  {ingrList.length > 0 ? (
                    <Table
                      dataSource={ingrList}
                      columns={[
                        {
                          title: '#',
                          dataIndex: 'key',
                          align: 'center',
                          width: 60,
                          render: (text, record, index) => {
                            return (
                              <div style={{ display: 'flex' }}>
                                <span style={{ flex: 1 }}>{index + 1}</span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'ID',
                          dataIndex: 'ingrId',
                          align: 'center',
                          width: 150,
                        },
                        {
                          title: 'รายการ',
                          dataIndex: 'ingrName',
                          align: 'center',
                          width: 260,
                        },
                        {
                          title: 'จำนวน',
                          dataIndex: 'quantity',
                          align: 'center',
                          width: 200,
                          render: (text, record) => (
                            <span>
                              {text} {record.ingrUnit}
                            </span>
                          ),
                        },
                      ]}
                      rowKey="ingrId"
                      pagination={false}
                    />
                  ) : (
                    'ไม่มีรายการ'
                  )}
                  <h5 style={{ marginTop: 20 }}>อื่นๆ</h5>{' '}
                  {stuffList.length > 0 ? (
                    <Table
                      dataSource={stuffList}
                      columns={[
                        {
                          title: '#',
                          dataIndex: 'key',
                          align: 'center',
                          width: 60,
                          render: (text, record, index) => {
                            return (
                              <div style={{ display: 'flex' }}>
                                <span style={{ flex: 1 }}>{index + 1}</span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'ID',
                          dataIndex: 'stuffId',
                          align: 'center',
                          width: 150,
                        },
                        {
                          title: 'รายการ',
                          dataIndex: 'stuffName',
                          align: 'center',
                          width: 260,
                        },
                        {
                          title: 'จำนวน',
                          dataIndex: 'quantity',
                          align: 'center',
                          width: 200,
                          render: (text, record) => (
                            <span>
                              {text} {record.stuffUnit}
                            </span>
                          ),
                        },
                      ]}
                      rowKey="ingrId"
                      pagination={false}
                    />
                  ) : (
                    'ไม่มีรายการ'
                  )}
                </Card.Body>
                <Card.Footer>
                  <div style={{ float: 'right' }}>
                    รวมทั้งสิ้น{' '}
                    {productList.length + ingrList.length + stuffList.length}{' '}
                    รายการ
                  </div>
                </Card.Footer>
              </>
            ) : (
              <Preloader show={promiseInProgress} />
            )}
          </Card>
        </div>
        <div style={{ flex: 2 }}>
          <Card
            border="light"
            className="bg-white px-4 py-4 mb-4"
            style={{
              borderRadius: '36px',
              boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              fontFamily: 'Prompt',
            }}>
            <Card.Header>
              <Row>
                <h5>ใบเบิกจ่ายคลังสินค้า</h5>
                <div># {reqId}</div>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>เวลาที่สร้าง: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.createdAt
                    ? moment(requisitData.createdAt).local('th').format('LLL')
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col>อัพเดทล่าสุด: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.updatedAt
                    ? moment(requisitData.updatedAt).local('th').format('LLL')
                    : ''}
                </Col>
              </Row>
              <Row>
                <Col>ผู้ทำรายการ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.creator && requisitData.creator.firstName}{' '}
                  {requisitData.creator && requisitData.creator.lastName}
                </Col>
              </Row>
              <Row>
                <Col>ผู้อนุมัติ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {!requisitData.approverId && 'รออนุมัติ'}
                  {requisitData.approver &&
                    requisitData.approver.firstName}{' '}
                  {requisitData.approver && requisitData.approver.lastName}
                </Col>
              </Row>
              <Row>
                <Col>ผู้ตรวจสอบสินค้า: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {!requisitData.validator &&
                    requisitData.requisitionStatus != 4 &&
                    'รอยืนยัน'}
                  {requisitData.requisitionStatus == 4 && 'รายการถูกยกเลิก'}
                  {requisitData.validator &&
                    requisitData.validator.firstName}{' '}
                  {requisitData.validator && requisitData.validator.lastName}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            border="light"
            className="bg-white px-4 py-4 mb-4"
            style={{
              borderRadius: '36px',
              boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              fontFamily: 'Prompt',
            }}>
            <Card.Body>
              <Row>
                <h5>ข้อมูลสาขา</h5>
              </Row>
              <Row>
                <Col>สาขา: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {requisitData.branch && requisitData.branch.branchName}
                </Col>
              </Row>
              <Row>
                <Col>ที่ตั้งสาขา: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {requisitData.branch && requisitData.branch.branchAddr}
                </Col>
              </Row>
              <Row>
                <Col>เบอร์ติดต่อสาขา: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.branch && requisitData.branch.branchTel}
                </Col>
              </Row>
              <Row>
                <Col>ผู้จัดการ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.branch &&
                    requisitData.branch.employee &&
                    requisitData.branch.employee.firstName}{' '}
                  {requisitData.branch &&
                    requisitData.branch.employee &&
                    requisitData.branch.employee.lastName}
                </Col>
              </Row>
              <Row>
                <Col>เบอร์ติดต่อผู้จัดการ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {requisitData.branch &&
                    requisitData.branch.employee &&
                    requisitData.branch.employee.tel}
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card
            border="light"
            className="bg-white px-4 py-4 mb-4"
            style={{
              borderRadius: '36px',
              boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              fontFamily: 'Prompt',
            }}>
            <Card.Body>
              <h5>สถานะดำเนินการ</h5>
              <Steps
                current={requisitData.requisitionStatus}
                progressDot={customDot}
                size="small"
                style={{ marginTop: 20 }}
                responsive={true}>
                <Step
                  title={
                    requisitData.requisitionStatus == 0
                      ? 'รออนุมัติ'
                      : 'อนุมัติแล้ว'
                  }
                  status={
                    requisitData.requisitionStatus == 0 ? 'wait' : 'finish'
                  }
                />
                <Step
                  title="กำลังดำเนินการ"
                  status={
                    requisitData.requisitionStatus < 2 ? 'wait' : 'finish'
                  }
                />
                <Step
                  title={
                    requisitData.requisitionStatus == 4 ? 'ยกเลิก' : 'เสร็จสิ้น'
                  }
                  status={
                    requisitData.requisitionStatus == 4
                      ? 'error'
                      : requisitData.requisitionStatus == 3
                      ? 'finish'
                      : 'wait'
                  }
                />
              </Steps>
              <div className="d-flex px-4 mt-4">
                {requisitData.requisitionStatus == 0 && (
                  <>
                    <Button
                      danger
                      ghost
                      style={{ flex: 1, marginRight: 12 }}
                      onClick={() => {
                        updateStatus(4);
                      }}>
                      <FontAwesomeIcon icon={faBan} className="approveIcon" />
                      ไม่อนุมัติ
                    </Button>
                    <Button
                      style={{ flex: 1 }}
                      type="primary"
                      onClick={() => {
                        updateStatus(1);
                      }}>
                      <FontAwesomeIcon icon={faCheck} className="approveIcon" />
                      อนุมัติ
                    </Button>
                  </>
                )}
                {requisitData.requisitionStatus == 1 && (
                  <>
                    <Button
                      type="primary"
                      style={{ flex: 1 }}
                      onClick={() => {
                        updateStatus(2);
                      }}>
                      <FontAwesomeIcon icon={faCheck} className="approveIcon" />
                      เริ่มดำเนินการ
                    </Button>
                  </>
                )}
                {requisitData && requisitData.requisitionStatus == 2 && (
                  <div style={{ flex: '1', textAlign: 'center' }}>
                    รอยืนยืนการรับที่ Application
                  </div>
                )}
                {requisitData && requisitData.requisitionStatus > 2 && (
                  <div style={{ flex: '1', textAlign: 'center' }}>
                    สิ้นสุดการทำรายการแล้ว
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};
export default GetRequisition;
