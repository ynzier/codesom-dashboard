import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table, Input, Button, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Card, Breadcrumb, InputGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { Routes } from 'routes';
import { IngrStffCreateModal } from 'components';
import storageService from 'services/storage.service';
const { Option } = Select;

const IngrAndStuffList = () => {
  let history = useHistory();
  let location = useLocation();
  const alert = useAlert();

  const { promiseInProgress } = usePromiseTracker({
    area: storageService.area.getDashboardIngrStuffList,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState('');

  useEffect(async () => {
    const filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == '')
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != '') return obj.type == option;
      // keyword option
      if (keyword != '' && option != '')
        return (
          obj.type == option &&
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          )
        );
    });
    setfilterData(filterTable);
    return () => {};
  }, [keyword, option]);

  const openRecord = productId => {
    history.push('/dashboard/product/getProduct/' + productId);
  };
  const fetchData = useCallback(() => {
    trackPromise(
      storageService
        .getDashboardIngrStuffList()
        .then(res => {
          setRecord(res.data);
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
      storageService.area.getDashboardIngrStuffList,
    );
  });
  useEffect(async () => {
    document.title = 'วัตถุดิบและอื่นๆ';
    fetchData();
    return () => {};
  }, []);

  const header = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
      align: 'center',
      width: 200,
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <>
            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              {record.name}
            </div>
          </>
        );
      },
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'type',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return <div>{record.type}</div>;
      },
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>{record.unit}</div>;
      },
    },
    // {
    //   key: 'key',
    //   title: 'Action',
    //   dataIndex: 'key',
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         <a
    //           onClick={() => {
    //             const productId = record.productId;
    //             openRecord(productId);
    //           }}>
    //           <FiEdit size={18} />
    //         </a>
    //       </div>
    //     );
    //   },
    // },
  ];
  const headerManager = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
      align: 'center',
      width: 200,
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <>
            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              {record.name}
            </div>
          </>
        );
      },
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'type',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return <div>{record.type}</div>;
      },
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>{record.unit}</div>;
      },
    },
  ];
  return (
    <>
      <IngrStffCreateModal
        showCreate={showCreate}
        setShowCreate={setShowCreate}
        fetchData={fetchData}
      />
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
            <Breadcrumb.Item active>วัตถุดิบและอื่นๆ</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings mb-1">
            <Row>
              <Col xs={8} md={6} lg={3} xl={4}>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="ค้นหาชื่อวัตถุดิบ / รหัสวัตถุดิบ"
                />
              </Col>
              <Col xs={4} md={4} xl={3}>
                <Select
                  className="mb-3"
                  style={{
                    width: 300,
                    fontFamily: 'Prompt',
                  }}
                  placeholder="ประเภท"
                  dropdownStyle={{ fontFamily: 'Prompt' }}
                  onChange={value => {
                    setOption(value);
                  }}>
                  <Option value="วัตถุดิบ">วัตถุดิบ</Option>
                  <Option value="อื่นๆ">อื่นๆ</Option>
                </Select>
              </Col>
              {!location.state?.isManager && (
                <Col xs={5} xl={{ span: 2, offset: 3 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowCreate(true);
                    }}>
                    เพิ่มรายการ
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            dataSource={keyword != '' || option != '' ? filterData : record}
            columns={location.state?.isManager ? headerManager : header}
            rowKey="productId"
            loading={promiseInProgress}
            pagination={{ pageSize: 20, showSizeChanger: false }}
            style={{
              fontFamily: 'Prompt',
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default IngrAndStuffList;
