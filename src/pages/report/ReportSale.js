import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { Routes } from 'routes';
import NumberFormat from 'react-number-format';
import BranchesService from 'services/branches.service';
import { Row, Col, Breadcrumb, Card } from 'react-bootstrap';
import { Select, Tabs, DatePicker } from 'antd';
import { Line, Pie, G2 } from '@ant-design/plots';

const { TabPane } = Tabs;
const { Option } = Select;
import 'antd/dist/antd.min.css';
import storageService from 'services/storage.service';
import reportService from 'services/report.service';

const TopSalePie = ({ data }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'totalCount',
    colorField: 'productName',
    radius: 0.8,
    theme: {
      styleSheet: {
        fontFamily: 'Prompt',
      },
    },
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};

const ReportSale = () => {
  const { RangePicker } = DatePicker;
  const [branchId, setBranchId] = useState();
  const [branchData, setbranchData] = useState([]);
  const [pickDate, setPickDate] = useState([]);
  const [data, setData] = useState([]);
  const [report, setReport] = useState({});
  const [topSale, setTopSale] = useState([]);
  const [totalItems, setTotalItems] = useState();
  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/55424a73-7cb8-4f79-b60d-3ab627ac5698.json',
    )
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log('fetch data failed', error);
      });
  };
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
      },
    },
  };

  const fetchReport = async date => {
    var data = date || null;
    await reportService
      .getDateReport({ reqDate: data })
      .then(res => setReport(res.data))
      .catch(err => console.log(err));
    await reportService
      .getDateTopSale({ reqDate: data })
      .then(res => {
        console.log(res.data.result);
        setTopSale(res.data.result);
        setTotalItems(res.data.totalItems);
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    document.title = 'รายงานยอดจำหน่าย';
    let mounted = true;
    asyncFetch();
    fetchReport();
    BranchesService.getAllBranch()
      .then(res => {
        if (mounted) {
          setbranchData(res.data);
        }
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
    return () => (mounted = false);
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
            <Breadcrumb.Item active>รายงานยอดจำหน่าย</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Row className="mb-4">
        <Col xs={12} xl={12}>
          <Card
            border="light"
            className="bg-white px-6 py-4"
            style={{
              borderRadius: '36px',
              boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
              fontFamily: 'Prompt',
            }}>
            <Card.Body>
              <Col md={12} xl={12} className="mb-3">
                <h2>รายงานยอดจำหน่าย</h2>
                <Row style={{ height: '100%' }} className="mb-3">
                  <Col md={4} style={{ height: '100%' }}>
                    <div>ชื่อสาขา</div>
                    <Select
                      className="mb-3"
                      showSearch
                      label="สาขา"
                      style={{
                        width: 300,
                        fontFamily: 'Prompt',
                      }}
                      placeholder="เลือกสาขา"
                      value={branchId}
                      optionFilterProp="children"
                      dropdownStyle={{ fontFamily: 'Prompt' }}
                      onChange={value => setBranchId(value)}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children
                          .toLowerCase()
                          .localeCompare(optionB.children.toLowerCase())
                      }>
                      {branchData.map(option => (
                        <Option key={option.brId} value={option.brId}>
                          {option.brName}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col md={4}>
                    <div>ช่วงวันที่</div>
                    <RangePicker
                      locale={locale}
                      size="large"
                      value={pickDate}
                      disabledDate={current => {
                        return moment() < current;
                      }}
                      ranges={{
                        วันนี้: [
                          moment().startOf('day'),
                          moment().endOf('day'),
                        ],
                        เดือนนี้: [
                          moment().startOf('month'),
                          moment().endOf('month'),
                        ],
                      }}
                      style={{
                        borderRadius: '10px',
                        fontFamily: 'Prompt',
                        height: 43.59,
                      }}
                      popupStyle={{ fontFamily: 'Prompt' }}
                      onChange={values => {
                        setPickDate(values);
                        fetchReport(values);
                      }}
                    />
                  </Col>
                </Row>
                <Card>
                  <Card.Body>
                    <Row style={{ textAlign: 'center' }} className="mb-2">
                      <Col>จำนวนออเดอร์</Col>
                      <Col>จำนวนสินค้าที่ขาย</Col>
                      <Col>ต้นทุน</Col>
                      <Col>กำไร</Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }} className="mb-3">
                      <Col>
                        <div className="box-report">{report.totalOrder}</div>
                      </Col>
                      <Col>
                        <div className="box-report">{totalItems}</div>
                      </Col>
                      <Col>
                        <div className="box-report">-</div>
                      </Col>
                      <Col>
                        <div className="box-report">-</div>
                      </Col>
                    </Row>
                    <Row className="my-5">
                      <Col className="mx-5">
                        <Row>
                          <Col>
                            <h5>สรุปยอด</h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col>ยอดขาย</Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.subTotal}
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
                          <Col>ยอดค่าจัดส่ง</Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.deliveryCost}
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
                          <Col>VAT 7%</Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalVat}
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
                          <Col>ยอดขายสุทธิ</Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.finalTotal}
                              decimalScale={2}
                              fixedDecimalScale={true}
                              decimalSeparator="."
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col className="mx-5">
                        <Row>
                          <Col>หน้าร้าน</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.takeAway}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalTakeAway}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>Line Man</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.deliveryLineman}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalLineman}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>Robinhood</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.deliveryRobinhood}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalRobinhood}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>Grab</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.deliveryGrab}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalGrab}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>Line Official</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.deliveryOff}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalOff}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>อื่นๆ</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.deliveryETC}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalETC}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row
                          style={{ height: 1, backgroundColor: '#d6d6d6' }}
                          className="my-3"
                        />
                        <Row>
                          <Col>เงินสด</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.paidCash}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalCash}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>Thai QR</Col>
                          <Col style={{ textAlign: 'center' }}>
                            <NumberFormat
                              value={report.paidQR}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" รายการ"
                            />
                          </Col>
                          <Col style={{ textAlign: 'right' }}>
                            <NumberFormat
                              value={report.totalQR}
                              decimalScale={0}
                              fixedDecimalScale={true}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix=" บาท"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row
                      style={{ height: 1, backgroundColor: '#d6d6d6' }}
                      className="my-3 mx-4"
                    />
                    <Row className="my-3 mx-4">
                      <Col>
                        <h5>สินค้าขายดี</h5>
                        <TopSalePie data={topSale} />
                      </Col>
                    </Row>
                    <Row>
                      <Line {...config} />
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default ReportSale;
