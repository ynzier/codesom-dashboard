import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table, DatePicker } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';

import {
  faHome,
  faSearch,
  faFileInvoice,
  faEraser,
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
  const { RangePicker } = DatePicker;
  const format = 'LLL';
  const { promiseInProgress } = usePromiseTracker({
    area: requisitionService.area.listAllReq,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState('');
  const [pickDate, setPickDate] = useState([]);

  useEffect(async () => {
    const filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == '' && pickDate.length < 1)
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != '' && pickDate.length < 1)
        return obj.requisitionStatus == option;
      // date
      if (keyword == '' && option == '' && pickDate.length > 0)
        return (
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option
      if (keyword != '' && option != '' && pickDate.length < 1)
        return (
          obj.requisitionStatus == option &&
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          )
        );
      // keyword date
      if (keyword != '' && option == '' && pickDate.length > 0)
        return (
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          ) &&
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // option date
      if (keyword == '' && option != '' && pickDate.length > 0)
        return (
          obj.requisitionStatus == option &&
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option date
      if (keyword != '' && option != '' && pickDate.length > 0)
        return (
          obj.requisitionStatus == option &&
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix() &&
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          )
        );
    });
    setfilterData(filterTable);
    return () => {};
  }, [keyword, option, pickDate]);

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
      width: 250,
      render: (text, record) => {
        return (
          <>
            <div>{moment(record.updatedAt).locale('th').format('LLL')}</div>
          </>
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'requisitionStatus',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            {text == 0
              ? 'รออนุมัติ'
              : text == 1
              ? 'อนุมัติแล้ว'
              : text == 2
              ? 'กำลังดำเนินการ'
              : text == 3
              ? 'เสร็จสิ้น'
              : 'ยกเลิก'}
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
              <Col xs={8} md={3}>
                <Form.Group>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={keyword}
                      placeholder="ค้นหารหัส/ชื่อสาขา"
                      onChange={e => setKeyword(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={4} md={2}>
                <Form.Group>
                  <Form.Select onChange={e => setOption(e.target.value)}>
                    <option value="">สถานะ</option>
                    <option value="0">รออนุมัติ</option>
                    <option value="1">อนุมัติแล้ว</option>
                    <option value="2">กำลังดำเนินการ</option>
                    <option value="3">เสร็จสิ้น</option>
                    <option value="4">ยกเลิก</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md="4">
                <RangePicker
                  locale={locale}
                  size="large"
                  ranges={{
                    วันนี้: [moment().startOf('day'), moment().endOf('day')],
                    เดือนนี้: [
                      moment().startOf('month'),
                      moment().endOf('month'),
                    ],
                  }}
                  style={{ borderRadius: '10px', fontFamily: 'Prompt' }}
                  popupStyle={{ fontFamily: 'Prompt' }}
                  onChange={setPickDate}
                />
              </Col>

              <Col xs={5} xl={{ span: 2, offset: 1 }}>
                <Button
                  className="w-100"
                  variant="codesom"
                  onClick={() => setShowCreate(true)}
                  style={{
                    color: '#fff',
                    paddingTop: '0.75rem',
                    borderRadius: '10px',
                    boxShadow: 'rgb(0 0 0 / 10%) 0px 0.5rem 0.7rem',
                  }}>
                  เพิ่มรายการ
                </Button>
              </Col>
            </Row>
            <Row>
              <Col md={{ offset: 8}}>
                <a
                  onClick={() => {
                    setKeyword('');
                    setOption('');
                    setPickDate([]);
                  }}
                  style={{
                    fontFamily: 'Prompt',
                    color: '#b4b4b4',
                    textDecorationLine: 'underline',
                    textAlign: 'right',
                  }}>
                  เคลียร์ค้นหา
                </a>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            tableLayout="fixed"
            dataSource={filterData.length > 0 ? filterData : record}
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
