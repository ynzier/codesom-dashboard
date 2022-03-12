import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import 'moment/locale/th';

import NumberFormat from 'react-number-format';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table, Steps, Popover } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import {
  faHome,
  faSearch,
  faFileInvoice,
} from '@fortawesome/free-solid-svg-icons';
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
import { Routes } from 'routes';
import { IngrStffCreateModal } from 'components';
import requisitionService from 'services/requisition.service';

const RequisitionList = () => {
  let history = useHistory();
  const alert = useAlert();
  const { Step } = Steps;
  const customDot = dot => <span>{dot}</span>;

  const { promiseInProgress } = usePromiseTracker({
    area: requisitionService.area.listAllReq,
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

  const openRecord = reqId => {
    history.push('/dashboard/warehouse/getRequisition/' + reqId);
  };
  const fetchData = useCallback(() => {
    trackPromise(
      requisitionService
        .listAllReq()
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
      requisitionService.area.listAllReq,
    );
  });
  useEffect(async () => {
    document.title = 'รายการวัตถุดิบทั้งหมด';
    fetchData();
    return () => {};
  }, []);

  const header = [
    {
      title: 'No.',
      dataIndex: 'requisitionId',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return (
          <div style={{ display: 'flex' }}>
            <span style={{ flex: 1 }}>{text}</span>
            <FontAwesomeIcon
              icon={faFileInvoice}
              size="xl"
              onClick={() => {
                const requisitionId = record.requisitionId;
                openRecord(requisitionId);
              }}
            />
          </div>
        );
      },
    },
    {
      title: 'สาขา',
      dataIndex: 'branchName',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <span className="branchName">{text}</span>;
      },
    },
    {
      title: 'จำนวน',
      dataIndex: 'itemCount',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return <div>{record.itemCount}</div>;
      },
    },
    {
      title: 'อัพเดทล่าสุดเมื่อ',
      dataIndex: 'updatedAt',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (
          <>
            <div>{moment(record.updateAt).locale('th').format('LL')}</div>
            <div>เวลา {moment(text).locale('th').format('LT')}</div>
          </>
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'requisitionStatus',
      align: 'center',
      width: 400,
      render: (text, record) => {
        return (
          <Steps
            current={record.requisitionStatus}
            progressDot={customDot}
            size="small"
            responsive={true}>
            <Step
              title={
                record.requisitionStatus == 0 ? 'รออนุมัติ' : 'อนุมัติแล้ว'
              }
              status={record.requisitionStatus == 0 ? 'wait' : 'finish'}
            />
            <Step
              title="กำลังดำเนินการ"
              status={record.requisitionStatus < 2 ? 'wait' : 'finish'}
            />
            <Step
              title={record.requisitionStatus == 4 ? 'ยกเลิก' : 'เสร็จสิ้น'}
              status={
                record.requisitionStatus == 4
                  ? 'error'
                  : record.requisitionStatus == 3
                  ? 'finish'
                  : 'wait'
              }
            />
          </Steps>
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
            <Breadcrumb.Item active>ประวัติการเบิกจ่ายสินค้า</Breadcrumb.Item>
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
            tableLayout="fixed"
            dataSource={filterData == null ? record : filterData}
            columns={header}
            rowKey="requisitionId"
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
export default RequisitionList;
