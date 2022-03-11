import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Form,
  Button,
  Card,
  Breadcrumb,
  InputGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { Routes } from 'routes';
import { IngrStffCreateModal } from 'components';
import storageService from 'services/storage.service';

const IngrAndStuffList = () => {
  let history = useHistory();
  const alert = useAlert();

  const { promiseInProgress } = usePromiseTracker({
    area: storageService.area.getDashboardIngrStuffList,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState();
  const search = value => {
    const filterTable = record.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setfilterData(filterTable);
  };
  const getFilter = value => {
    console.log(value);
    if (value) {
      var filterTable = record.filter(record => record.type == value);
      setfilterData(filterTable);
    } else {
      setfilterData(record);
    }
  };

  const openRecord = prId => {
    history.push('/dashboard/product/getProduct/' + prId);
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
    document.title = 'รายการวัตถุดิบทั้งหมด';
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
    {
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => {
        return (
          <div>
            <span
              onClick={() => {
                const prId = record.prId;
                openRecord(prId);
              }}>
              <FiEdit size={18} />
            </span>
          </div>
        );
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
            <Breadcrumb.Item active>รายการวัตถุดิบทั้งหมด</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings mb-3">
            <Row>
              <Col xs={8} md={6} lg={3} xl={4}>
                <Form.Group>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="ค้นหาชื่อวัตถุดิบ / รหัสวัตถุดิบ"
                      onChange={e => search(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={4} md={4} xl={3}>
                <Form.Group>
                  <Form.Select onChange={e => getFilter(e.target.value)}>
                    <option value="">ประเภท</option>
                    <option value="วัตถุดิบ">วัตถุดิบ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={5} xl={{ span: 2, offset: 3 }}>
                <Button
                  className="w-100"
                  variant="codesom"
                  onClick={() => setShowCreate(true)}
                  style={{
                    color: '#fff',
                    height: '50px',
                    paddingTop: '0.75rem',
                    borderRadius: '10px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  เพิ่มรายการ
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            dataSource={filterData == null ? record : filterData}
            columns={header}
            rowKey="prId"
            loading={promiseInProgress}
            pagination={{ pageSize: 20 }}
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
