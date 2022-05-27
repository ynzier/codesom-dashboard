import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Routes } from 'routes';
import BranchesService from 'services/branches.service';
import NumberFormat from 'react-number-format';
import { Row, Col, Breadcrumb, Card } from 'react-bootstrap';
import { Select, Tabs } from 'antd';
import { Line } from '@ant-design/plots';
import { Preloader } from 'components';

const { TabPane } = Tabs;
const { Option } = Select;

import reportService from 'services/report.service';
import TokenService from 'services/token.service';

const LineChart = ({ data, type }) => {
  const config = {
    data,
    xField: 'date',
    yField: type,
    seriesField: 'ingrName',
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
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.hour}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{
                      marginBottom: 4,
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
                        {type == 'totalCost' ? (
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

const ReportIngr = props => {
  const { selectBranch } = props;
  const [branchId, setBranchId] = useState([]);
  const [branchData, setbranchData] = useState([]);
  const [graphTotal, setGraphTotal] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const fetchChart = async branchId => {
    await reportService
      .getIngrChart({ branchId: branchId })
      .then(res => {
        setGraphTotal(res.data.result);
      })
      .catch(err => console.log(err));
  };
  useEffect(async () => {
    document.title = 'รายงานการใช้วัตถุดิบ';
    let mounted = true;
    const role = await TokenService.getUser().authPayload.roleId;
    if (role == 1) {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchChart());
          }, 500);
        }),
      );
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
    if (selectBranch != null) {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchChart([selectBranch]));
          }, 500);
        }),
      );
    }
    return () => {};
  }, [selectBranch]);

  useEffect(async () => {
    const role = await TokenService.getUser().authPayload.roleId;
    if (role == 1)
      if (branchId)
        await trackPromise(
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(fetchChart(branchId));
            }, 500);
          }),
        );
    return () => {};
  }, [branchId]);

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
            <Breadcrumb.Item active>รายงานการใช้วัตถุดิบ</Breadcrumb.Item>
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
                <h2>รายงานการใช้วัตถุดิบ</h2>
                <Row style={{ height: '100%' }} className="mb-3">
                  {selectBranch == null && (
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
                </Row>
                <Card>
                  <Card.Body>
                    <Row>
                      <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="ปริมาณที่ใช้" key="1">
                          {promiseInProgress ? (
                            <Preloader show={promiseInProgress} />
                          ) : (
                            <LineChart data={graphTotal} type="totalCount" />
                          )}
                        </TabPane>
                        <TabPane tab="ต้นทุน" key="2">
                          {promiseInProgress ? (
                            <Preloader show={promiseInProgress} />
                          ) : (
                            <LineChart data={graphTotal} type="totalCost" />
                          )}
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
export default ReportIngr;
