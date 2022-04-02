import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { Routes } from 'routes';
import { Preloader } from 'components';
import BranchesService from 'services/branches.service';
import { Row, Col, Breadcrumb, Card } from 'react-bootstrap';
import { Select, Tabs, Table } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;
import 'antd/dist/antd.min.css';
import storageService from 'services/storage.service';
const BranchWarehouse = props => {
  const { selectBranch } = props;
  const [branchData, setbranchData] = useState([]);
  const { promiseInProgress } = usePromiseTracker();
  const [productList, setProductList] = useState([]);
  const [ingrList, setIngrList] = useState([]);
  const [stuffList, setStuffList] = useState([]);
  useEffect(() => {
    document.title = 'คลังสาขา';
    let mounted = true;
    if (!selectBranch)
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
  useEffect(async () => {
    if (selectBranch)
      try {
        await storageService
          .getAllProductInStorage(selectBranch)
          .then(res => setProductList(res.data));
        await storageService
          .getAllIngrInStorage(selectBranch)
          .then(res => setIngrList(res.data));
        await storageService
          .getAllStuffInStorage(selectBranch)
          .then(res => setStuffList(res.data));
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);
        alert.show(resMessage, { type: 'error' });
      }
    return () => {};
  }, [selectBranch]);

  const handleBranchChange = async value => {
    try {
      await storageService
        .getAllProductInStorage(value)
        .then(res => setProductList(res.data));
      await storageService
        .getAllIngrInStorage(value)
        .then(res => setIngrList(res.data));
      await storageService
        .getAllStuffInStorage(value)
        .then(res => setStuffList(res.data));
    } catch (error) {
      console.log(error);
    }
  };

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
            <Breadcrumb.Item active>คลังสาขา</Breadcrumb.Item>
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
                <h2>รายการที่มีในคลังสินค้า</h2>
                {!selectBranch && (
                  <Select
                    showSearch
                    label="สาขา"
                    style={{ width: 300, fontFamily: 'Prompt' }}
                    placeholder="เลือกสาขา"
                    optionFilterProp="children"
                    dropdownStyle={{ fontFamily: 'Prompt' }}
                    onChange={value => handleBranchChange(value)}
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
                )}
              </Col>
              <Tabs>
                {!promiseInProgress ? (
                  <>
                    <TabPane tab="สินค้า" key="1">
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
                              dataIndex: 'productId',
                              align: 'center',
                            },
                            {
                              title: 'รายการ',
                              align: 'center',
                              render: (text, record) => {
                                return <span>{record.product.prName}</span>;
                              },
                            },
                            {
                              title: 'คงเหลือ',
                              dataIndex: 'itemRemain',
                              align: 'center',
                              width: 200,
                              sorter: {
                                compare: (a, b) => b.itemRemain - a.itemRemain,
                              },
                              render: (text, record) => {
                                return (
                                  <span
                                    style={{
                                      color: text < 10 ? 'red' : 'black',
                                    }}>
                                    {text} {record.product.prUnit}
                                  </span>
                                );
                              },
                            },
                            {
                              title: 'อัพเดทล่าสุด',
                              dataIndex: 'updatedAt',
                              align: 'center',
                              render: (text, record) => {
                                return moment(text).locale('th').format('LLL');
                              },
                            },
                          ]}
                          rowKey="productId"
                          pagination={false}
                        />
                      ) : (
                        'ไม่มีรายการ'
                      )}
                    </TabPane>
                    <TabPane tab="วัตถุดิบ" key="2">
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
                            },
                            {
                              title: 'รายการ',
                              align: 'center',
                              render: (text, record) => {
                                return (
                                  <span>{record.ingredient.ingrName}</span>
                                );
                              },
                            },
                            {
                              title: 'คงเหลือ',
                              dataIndex: 'itemRemain',
                              align: 'center',
                              width: 200,
                              sorter: {
                                compare: (a, b) => b.itemRemain - a.itemRemain,
                              },
                              render: (text, record) => (
                                <span
                                  style={{
                                    color: text < 10 ? 'red' : 'black',
                                  }}>
                                  {text} {record.ingredient.ingrUnit}
                                </span>
                              ),
                            },
                            {
                              title: 'อัพเดทล่าสุด',
                              dataIndex: 'updatedAt',
                              align: 'center',
                              render: (text, record) => {
                                return moment(text).locale('th').format('LLL');
                              },
                            },
                          ]}
                          rowKey="ingrId"
                          pagination={false}
                        />
                      ) : (
                        'ไม่มีรายการ'
                      )}
                    </TabPane>
                    <TabPane tab="อื่นๆ" key="3">
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
                            },
                            {
                              title: 'รายการ',
                              dataIndex: 'stuffName',
                              align: 'center',
                              render: (text, record) => {
                                return <span>{record.stuff.stuffName}</span>;
                              },
                            },
                            {
                              title: 'คงเหลือ',
                              dataIndex: 'itemRemain',
                              align: 'center',
                              width: 200,
                              sorter: {
                                compare: (a, b) => b.itemRemain - a.itemRemain,
                              },
                              render: (text, record) => (
                                <span
                                  style={{
                                    color: text < 10 ? 'red' : 'black',
                                  }}>
                                  {text} {record.stuff.stuffUnit}
                                </span>
                              ),
                            },
                            {
                              title: 'อัพเดทล่าสุด',
                              dataIndex: 'updatedAt',
                              align: 'center',
                              render: (text, record) => {
                                return moment(text).locale('th').format('LLL');
                              },
                            },
                          ]}
                          rowKey="ingrId"
                          pagination={false}
                        />
                      ) : (
                        'ไม่มีรายการ'
                      )}
                    </TabPane>
                  </>
                ) : (
                  <Preloader show={promiseInProgress} />
                )}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default BranchWarehouse;
