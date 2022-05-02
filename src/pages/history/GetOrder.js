import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Routes } from 'routes';
import { Table, Steps } from 'antd';
import NumberFormat from 'react-number-format';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';

import 'moment/locale/th';
import { Image, Popover } from 'antd';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Preloader } from 'components';
import { Card, Col, Row, Breadcrumb, Button } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import historyService from 'services/history.service';

const GetOrder = () => {
  const { promiseInProgress: loadingRecord } = usePromiseTracker({
    area: 'loadingRecord',
  });
  const { id } = useParams();
  const customDot = dot => <span>{dot}</span>;
  const [orderItems, setOrderItems] = useState([]);
  const [receiptData, setReceiptData] = useState({});
  const [orderDetail, setOrderDetail] = useState({});
  const [promoDetail, setPromoDetail] = useState([]);
  const { Step } = Steps;
  const alert = useAlert();
  useEffect(() => {
    document.title = 'ประวัติออเดอร์';
    fetchRecDetail(id);
  }, []);
  const fetchRecDetail = id => {
    trackPromise(
      historyService
        .getOrderItemsByIdDashboard(id)
        .then(res => {
          const receiveData = res.data;
          setOrderItems(receiveData.orderItems);
          setReceiptData(receiveData.receipt);
          setOrderDetail(receiveData.orderDetail);
          setPromoDetail(receiveData.promoItems);
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
  };
  const content = (
    <div style={{ width: 300, fontFamily: 'Prompt' }}>
      <Row>
        <Col>ค่าบริการ: </Col>
        <Col
          style={{
            textAlign: 'right',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
          <NumberFormat
            value={receiptData.omiseFee}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix=" บาท"
          />
        </Col>
      </Row>
      <Row>
        <Col>ภาษี 7%: </Col>
        <Col
          style={{
            textAlign: 'right',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
          <NumberFormat
            value={receiptData.orderTax}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix=" บาท"
          />
        </Col>
      </Row>
      <Row>
        <Col>ยอดเงิน (ไม่รวมภาษี): </Col>
        <Col
          style={{
            textAlign: 'right',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
          <NumberFormat
            value={receiptData.orderNet}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix=" บาท"
          />
        </Col>
      </Row>
      <Row>
        <Col>ยอดเงินสุทธิ: </Col>
        <Col
          style={{
            textAlign: 'right',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
          <NumberFormat
            value={receiptData.orderTotal}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix=" บาท"
          />
        </Col>
      </Row>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item href={Routes.Home.path}>
              <FontAwesomeIcon icon={faHome} />
            </Breadcrumb.Item>
            <Breadcrumb.Item href={Routes.OrderHistory.path}>
              ประวัติออเดอร์
            </Breadcrumb.Item>
            <Breadcrumb.Item active>หมายเลขออเดอร์: {id}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>{' '}
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
            {!loadingRecord ? (
              <>
                <Card.Body>
                  <h5>สินค้า</h5>
                  {orderItems.length > 0 ? (
                    <Table
                      dataSource={orderItems}
                      columns={[
                        {
                          title: '#',
                          dataIndex: 'itemKey',
                          align: 'center',
                          render: (text, record, index) => {
                            return (
                              <div style={{ display: 'flex' }}>
                                <span style={{ flex: 1 }}>{index + 1}</span>
                              </div>
                            );
                          },
                        },
                        {
                          title: 'รายการ',
                          align: 'center',
                          render: (text, record) => {
                            return <span>{record.product.productName}</span>;
                          },
                        },
                        {
                          title: 'จำนวน',
                          dataIndex: 'prCount',
                          align: 'center',
                          render: (text, record) => (
                            <span>
                              {text} {record.prodUnit}
                            </span>
                          ),
                        },
                        {
                          title: 'ราคา',
                          dataIndex: 'productPrice',
                          align: 'center',
                          render: (text, record) => {
                            return (
                              <NumberFormat
                                value={record.productPrice}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                decimalSeparator="."
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix=" บาท"
                              />
                            );
                          },
                        },
                      ]}
                      rowKey="prodId"
                      pagination={false}
                    />
                  ) : (
                    'ไม่มีรายการ'
                  )}
                  <h5 className="mt-3">โปรโมชัน</h5>
                  {promoDetail?.length > 0 ? (
                    <Table
                      dataSource={promoDetail}
                      columns={[
                        {
                          title: 'รูป',
                          dataIndex: 'image',
                          align: 'center',
                          width: 100,
                          render: (text, record) => {
                            return (
                              <Image
                                alt={record.productDetail}
                                width="100%"
                                style={{ objectFit: 'cover' }}
                                src={
                                  record?.promotion?.image?.imgObj
                                    ? record?.promotion?.image?.imgObj
                                    : 'error'
                                }
                                fallback="data:image/png;base64,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"
                              />
                            );
                          },
                        },
                        {
                          title: 'รายการ',
                          align: 'center',
                          render: (text, record) => {
                            return <span>{record.promotion.promoName}</span>;
                          },
                        },
                        {
                          title: 'จำนวน',
                          dataIndex: 'promoCount',
                          align: 'center',
                        },
                        {
                          title: 'ส่วนลด',
                          align: 'center',
                          render: (text, record) => {
                            return (
                              <NumberFormat
                                value={record.promoCost - record.promoPrice}
                                decimalScale={2}
                                fixedDecimalScale={true}
                                decimalSeparator="."
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix=" บาท"
                              />
                            );
                          },
                        },
                      ]}
                      rowKey="prodId"
                      pagination={false}
                    />
                  ) : (
                    'ไม่มีรายการ'
                  )}
                </Card.Body>
                <Card.Footer>
                  <div style={{ float: 'right' }}>
                    รวมทั้งสิ้น {orderItems.length} รายการ
                  </div>
                </Card.Footer>
              </>
            ) : (
              <Preloader show={loadingRecord} />
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
                <h5>ประวัติออเดอร์</h5>
              </Row>
              <Row>
                <Col># {id}</Col>
                <Col style={{ textAlign: 'right' }}>
                  {orderDetail.receipt?.paidType === 'qr' && (
                    <Popover
                      content={content}
                      placement="leftTop"
                      title="Omise"
                      trigger="click">
                      <a href="">Omise QR</a>
                    </Popover>
                  )}
                  {orderDetail.receipt?.paidType === 'cash' && 'เงินสด'}
                  {orderDetail.receipt?.paidType === 'dolphin' &&
                    'Dolphin Wallet'}
                  {orderDetail.receipt?.paidType === 'shopee' &&
                    'Shopee Wallet'}
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col>เวลาที่ทำรายการ: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {moment(orderDetail.createTimestamp)
                    .locale('th')
                    .format('LLL')}
                </Col>
              </Row>
              <Row>
                <Col>ราคารวม: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <NumberFormat
                    value={receiptData.receiptSubtotal}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator="."
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix=" บาท"
                  />
                </Col>
              </Row>
              <Row>
                <Col>ส่วนลด: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <NumberFormat
                    value={receiptData.receiptDiscount}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator="."
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix=" บาท"
                  />
                </Col>
              </Row>
              <Row>
                <Col>ราคา Net: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <NumberFormat
                    value={receiptData.receiptNet}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator="."
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix=" บาท"
                  />
                </Col>
              </Row>
              <Row>
                <Col>ภาษี 7%: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <NumberFormat
                    value={receiptData.receiptTax}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator="."
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix=" บาท"
                  />
                </Col>
              </Row>
              {orderDetail.platformId == 5 && (
                <Row>
                  <Col>ค่าจัดส่ง: </Col>
                  <Col
                    style={{
                      textAlign: 'right',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}>
                    <NumberFormat
                      value={receiptData.lalaFare}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      decimalSeparator="."
                      displayType={'text'}
                      thousandSeparator={true}
                      suffix=" บาท"
                    />
                  </Col>
                </Row>
              )}
              <Row>
                <Col>ราคาสุทธิ (รวมภาษี): </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  <NumberFormat
                    value={receiptData.receiptTotal}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    decimalSeparator="."
                    displayType={'text'}
                    thousandSeparator={true}
                    suffix=" บาท"
                  />
                </Col>
              </Row>
              <Row>
                <Col>การรับสินค้า: </Col>
                <Col
                  style={{
                    textAlign: 'right',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}>
                  {orderDetail.orderType == 'takeaway' && 'รับกลับ'}
                  {orderDetail.orderType == 'delivery' && 'เดลิเวอรี'}
                </Col>
              </Row>
              {orderDetail.orderType == 'delivery' && (
                <>
                  <Row>
                    <Col>แพลตฟอร์ม: </Col>
                    <Col
                      style={{
                        textAlign: 'right',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                      {orderDetail.delivery_platform.platformName}
                    </Col>
                  </Row>
                  <Row>
                    <Col>รหัสอ้างอิง: </Col>
                    <Col
                      style={{
                        textAlign: 'right',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}>
                      {orderDetail.platformId == 5 ? (
                        <a
                          target="_blank"
                          href={orderDetail.lalamove.shareLink}
                          rel="noreferrer">
                          {orderDetail.orderRefNo}
                        </a>
                      ) : (
                        orderDetail.orderRefNo
                      )}
                    </Col>
                  </Row>
                </>
              )}
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
                  {orderDetail.branch?.branchName}
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
                  {orderDetail.branch?.branchAddr}
                </Col>
              </Row>
              <Row>
                <Col>เบอร์ติดต่อสาขา: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {orderDetail.branch?.branchTel}
                </Col>
              </Row>
              <Row>
                <Col>ผู้จัดการ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {orderDetail.branch &&
                    orderDetail.branch?.employee &&
                    orderDetail.branch?.employee.firstName}{' '}
                  {orderDetail.branch &&
                    orderDetail.branch?.employee &&
                    orderDetail.branch?.employee.lastName}
                </Col>
              </Row>
              <Row>
                <Col>เบอร์ติดต่อผู้จัดการ: </Col>
                <Col style={{ textAlign: 'right' }}>
                  {orderDetail.branch &&
                    orderDetail.branch?.employee &&
                    orderDetail.branch?.employee.tel}
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
                current={orderDetail.orderStatus}
                progressDot={customDot}
                size="small"
                style={{ marginTop: 20 }}
                responsive={true}>
                <Step
                  title={
                    orderDetail.orderStatus == 0
                      ? 'กำลังดำเนินการ'
                      : 'กำลังดำเนินการ'
                  }
                />
                <Step
                  title={orderDetail.orderStatus == 2 ? 'ยกเลิก' : 'เสร็จสิ้น'}
                  status={
                    orderDetail.orderStatus == 2
                      ? 'error'
                      : orderDetail.orderStatus == 1
                      ? 'finish'
                      : 'wait'
                  }
                />
              </Steps>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};
export default GetOrder;
