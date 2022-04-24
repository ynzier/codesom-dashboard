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
import { Line, Pie } from '@ant-design/plots';
const { TabPane } = Tabs;
const { Option } = Select;
import reportService from 'services/report.service';
import TokenService from 'services/token.service';

const TopSalePie = ({ data, type }) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: type,
    colorField: 'productName',
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <div style={{ marginTop: 16 }}>{title}</div>
            <ul
              style={{
                paddingLeft: 0,
                paddingTop: 8,
              }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.productName}
                    data-index={index}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color }}></span>
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {type == 'totalValue' ? (
                          <NumberFormat
                            value={value}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        ) : (
                          value
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
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

const LineChart = ({ data, type }) => {
  const config = {
    data,
    xField: 'date',
    yField: type,
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    smooth: true,
    theme: {
      styleSheet: {
        fontFamily: 'Prompt',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <div style={{ marginTop: 16 }}>{title}</div>
            <ul
              style={{
                paddingLeft: 0,
                columnCount: parseInt(items.length / 5),
                paddingTop: 8,
                columnGap: 16,
              }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.hour}
                    data-index={index}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color }}></span>
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {type == 'totalValue' ? (
                          <NumberFormat
                            value={value}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        ) : (
                          value
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
  };
  return <Line {...config} />;
};

const TimeChart = ({ data, type }) => {
  const config = {
    data,
    xField: 'hour',
    yField: type,
    seriesField: 'branch',
    legend: {
      position: 'top',
    },
    smooth: true,
    theme: {
      styleSheet: {
        fontFamily: 'Prompt',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    yAxis: {
      label:
        type === 'orderTotal'
          ? {
              formatter: v =>
                `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`),
            }
          : {
              formatter: v => v,
            },
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <div style={{ marginTop: 16 }}>{title}:00</div>
            <ul
              style={{
                paddingLeft: 0,
                columnCount: parseInt(items.length / 5),
                paddingTop: 8,
                columnGap: 16,
              }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.hour}
                    data-index={index}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color }}></span>
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {type == 'orderTotal' ? (
                          <NumberFormat
                            value={value}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        ) : (
                          value
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },

    xAxis: {
      min: 0,
      max: 23,
      tickInterval: 1,
      label: { formatter: v => v + ':00' },

      grid: {
        line: {
          style: {
            stroke: '#eee',
          },
        },
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };
  return <Line {...config} />;
};

const BenefitChart = ({ data }) => {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    smooth: true,
    theme: {
      styleSheet: {
        fontFamily: 'Prompt',
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <div style={{ marginTop: 16 }}>{title}</div>
            <ul
              style={{
                paddingLeft: 0,
                columnCount: parseInt(items.length / 5),
                paddingTop: 8,
                columnGap: 16,
              }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.hour}
                    data-index={index}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color }}></span>
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        <NumberFormat
                          value={value}
                          decimalScale={2}
                          fixedDecimalScale={true}
                          decimalSeparator="."
                          displayType={'text'}
                          thousandSeparator={true}
                        />{' '}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };
  return <Line {...config} />;
};
const BestSellerChart = ({ data, type }) => {
  const config = {
    data,
    xField: 'date',
    yField: type,
    seriesField: 'productName',
    legend: {
      position: 'top',
    },
    smooth: true,
    theme: {
      styleSheet: {
        fontFamily: 'Prompt',
      },
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <div style={{ marginTop: 16 }}>{title}</div>
            <ul
              style={{
                paddingLeft: 0,
                columnCount: parseInt(items.length / 5),
                paddingTop: 8,
                columnGap: 16,
              }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.hour}
                    data-index={index}
                    style={{
                      marginBottom: 8,
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color }}></span>
                    <span
                      style={{
                        display: 'inline-flex',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <span style={{ marginRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">
                        {type == 'totalValue' ? (
                          <NumberFormat
                            value={value}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        ) : (
                          value
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };
  return <Line {...config} />;
};

const ReportSale = props => {
  const { selectBranch } = props;
  const { RangePicker } = DatePicker;
  const [branchId, setBranchId] = useState([]);
  const [branchData, setbranchData] = useState([]);
  const [pickDate, setPickDate] = useState([]);
  const [report, setReport] = useState({});
  const [topSale, setTopSale] = useState([]);
  const [totalItems, setTotalItems] = useState();
  const [graphTotal, setGraphTotal] = useState([]);
  const [benefitGraph, setBenefitGraph] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [scatterData, setScatterData] = useState([]);

  const fetchReport = async (branchId, date) => {
    var reqDate = date || null;
    await reportService
      .getDateReport({ branchId: branchId, reqDate: reqDate })
      .then(res => {
        setReport(res.data);
      })
      .catch(err => console.log(err));
    await reportService
      .getDateTopSale({ branchId: branchId, reqDate: reqDate })
      .then(res => {
        setTopSale(res.data.result);
        setTotalItems(res.data.totalItems);
      })
      .catch(err => console.log(err));
    await reportService
      .getTimeChart({ branchId: branchId, reqDate: reqDate })
      .then(res => {
        setScatterData(res.data.result);
      })
      .catch(err => console.log(err));
  };

  const fetchChart = async branchId => {
    await reportService
      .getProductChart({ branchId: branchId })
      .then(res => {
        setBestSeller(res.data.result);
      })
      .catch(err => console.log(err));
    await reportService
      .getChartReport({ branchId: branchId })
      .then(res => {
        setGraphTotal(res.data.dateReport);
        setBenefitGraph(res.data.benefitReport);
      })
      .catch(err => console.log(err));
  };
  useEffect(async () => {
    document.title = 'รายงานยอดจำหน่าย';
    let mounted = true;
    const role = await TokenService.getUser().authPayload.roleId;
    if (role == 1) {
      fetchReport();
      fetchChart();
      BranchesService.getAllBranchName()
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
    }
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(async () => {
    if (selectBranch) {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchChart([selectBranch]));
          }, 500);
        }),
      );
      if (pickDate.length > 0) {
        await trackPromise(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(fetchReport([selectBranch], pickDate));
            }, 500);
          }),
        );
      } else {
        await trackPromise(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(fetchReport([selectBranch]));
            }, 500);
          }),
        );
      }
    }
    return () => {};
  }, [selectBranch, pickDate]);

  useEffect(async () => {
    const role = await TokenService.getUser().authPayload.roleId;
    if (role == 1) {
      if (pickDate.length < 1 && branchId.length < 1) fetchReport(branchId);
      if (pickDate.length > 0 && branchId.length > 0) {
        fetchReport(branchId, pickDate);
      }
      if (pickDate.length < 1 && branchId.length > 0) {
        fetchReport(branchId);
      }
      if (pickDate.length > 0 && branchId.length < 1) {
        fetchReport(branchId, pickDate);
      }
      if (branchId) fetchChart(branchId);
    }
    return () => {};
  }, [branchId, pickDate]);

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
                  {!selectBranch && (
                    <Col md={4} style={{ height: '100%' }}>
                      <div style={{ fontWeight: 600 }}>ชื่อสาขา</div>
                      <Select
                        className="mb-3"
                        showSearch
                        label="สาขา"
                        mode="multiple"
                        style={{
                          width: 300,
                          fontFamily: 'Prompt',
                        }}
                        placeholder="เลือกสาขา"
                        value={branchId}
                        optionFilterProp="children"
                        dropdownStyle={{ fontFamily: 'Prompt' }}
                        onChange={value => {
                          setBranchId(value);
                        }}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }>
                        {branchData.map(option => (
                          <Option key={option.branchId} value={option.branchId}>
                            {option.branchName}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                  )}
                  <Col md={4}>
                    <div style={{ fontWeight: 600 }}>ช่วงวันที่</div>
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
                      onChange={date => {
                        if (!date) return setPickDate([]);
                        setPickDate(date);
                      }}
                    />
                  </Col>
                </Row>
                <Card>
                  <Card.Body>
                    <Row style={{ textAlign: 'center' }} className="mb-2">
                      <Col md={{ offset: 2, span: 4 }}>จำนวนออเดอร์</Col>
                      <Col md="4">จำนวนสินค้าที่ขาย</Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }} className="mb-3">
                      <Col md={{ offset: 2, span: 4 }}>
                        <div className="box-report">{report.totalOrder}</div>
                      </Col>
                      <Col md="4">
                        <div className="box-report">{totalItems}</div>
                      </Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }} className="mb-2">
                      <Col>ยอดขาย</Col>
                      <Col>ต้นทุน</Col>
                      <Col>กำไร</Col>
                    </Row>
                    <Row style={{ textAlign: 'center' }} className="mb-3">
                      <Col>
                        <div className="box-report">
                          <NumberFormat
                            value={report.subTotal}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="box-report">
                          <NumberFormat
                            value={report.totalCost}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
                      </Col>
                      <Col>
                        <div className="box-report">
                          <NumberFormat
                            value={report.totalBenefit}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            decimalSeparator="."
                            displayType={'text'}
                            thousandSeparator={true}
                          />
                        </div>
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
                              value={report.deliveryFare}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                              decimalScale={2}
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
                    <Row>
                      <h4>สินค้าขายดี</h4>
                      <Col>
                        <Tabs defaultActiveKey="1" centered>
                          <TabPane tab="ยอดขาย" key="1">
                            <TopSalePie data={topSale} type="totalValue" />
                            <BestSellerChart
                              data={bestSeller}
                              type="totalValue"
                            />
                          </TabPane>
                          <TabPane tab="จำนวนสินค้า" key="2">
                            <TopSalePie data={topSale} type="totalCount" />
                            <BestSellerChart
                              data={bestSeller}
                              type="totalCount"
                            />
                          </TabPane>
                        </Tabs>
                      </Col>
                    </Row>
                    <Row
                      style={{ height: 1, backgroundColor: '#d6d6d6' }}
                      className="my-3"
                    />
                    <Row>
                      <h4>ช่องทางการจำหน่าย</h4>
                      <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="ยอดขาย" key="1">
                          <LineChart data={graphTotal} type="totalValue" />
                        </TabPane>
                        <TabPane tab="จำนวนออเดอร์" key="2">
                          <LineChart data={graphTotal} type="total" />
                        </TabPane>
                      </Tabs>
                    </Row>
                    <Row
                      style={{ height: 1, backgroundColor: '#d6d6d6' }}
                      className="my-3"
                    />
                    <Row>
                      <h4>ยอดขายตามช่วงเวลา</h4>
                      <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="ยอดขาย" key="1">
                          <TimeChart data={scatterData} type="orderTotal" />
                        </TabPane>
                        <TabPane tab="จำนวนออเดอร์" key="2">
                          <TimeChart data={scatterData} type="ordDuplicate" />
                        </TabPane>
                      </Tabs>
                    </Row>
                    <Row
                      style={{ height: 1, backgroundColor: '#d6d6d6' }}
                      className="my-3"
                    />
                    <Row>
                      <h4>ต้นทุน/ยอดขาย</h4>
                      <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="ต้นทุน/ยอดขาย" key="1">
                          <BenefitChart data={benefitGraph} />
                        </TabPane>
                      </Tabs>
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
