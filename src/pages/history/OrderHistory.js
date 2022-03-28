import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faFileInvoice,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';
import { Table, DatePicker } from 'antd';
import { useHistory } from 'react-router-dom';
import { Routes } from 'routes';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import {
  Col,
  Row,
  Form,
  Button,
  Card,
  Breadcrumb,
  InputGroup,
} from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import NumberFormat from 'react-number-format';

import historyService from 'services/history.service';
import BranchesService from 'services/branches.service';

var getBranchData = [];
const OrderHistory = props => {
  const { RangePicker } = DatePicker;
  let history = useHistory();
  const [record, setRecord] = useState([]);
  const [branchData, setbranchData] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState('');
  const [pickDate, setPickDate] = useState([]);
  useEffect(async () => {
    var filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == '' && pickDate.length < 1)
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != '' && pickDate.length < 1)
        return obj.brId == option;
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
          obj.brId == option &&
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
          obj.brId == option &&
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option date
      if (keyword != '' && option != '' && pickDate.length > 0)
        return (
          obj.brId == option &&
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

  useEffect(() => {
    document.title = 'ประวัติการขายสินค้า';
    let mounted = true;
    historyService
      .listOrderDashboard()
      .then(res => setRecord(res.data))
      .catch(err => console.log(err));
    BranchesService.getAllBranch()
      .then(res => {
        if (mounted) {
          getBranchData = res.data;
          setbranchData(getBranchData);
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
    return () => {
      mounted = false;
    };
  }, []);

  const openRecord = id => {
    history.push('/dashboard/history/GetOrder/' + id);
  };

  const header = [
    {
      title: 'รหัสรายการ',
      dataIndex: 'ordId',
      key: 'ordId',
      align: 'center',
      sorter: {
        compare: (a, b) => b.ordId - a.ordId,
      },
      render: (text, record) => {
        return (
          <a
            onClick={() => {
              openRecord(text);
            }}
            style={{ textDecorationLine: 'underline' }}>
            {text}
          </a>
        );
      },
    },
    {
      title: 'สาขา',
      dataIndex: 'brName',
      align: 'center',
    },
    {
      title: 'ประเภท',
      dataIndex: 'ordType',
      align: 'center',
      render: (text, record) => {
        if (text == 'takeaway') return <p>รับกลับ</p>;
        if (text == 'delivery') return <p>เดลิเวอรี่</p>;
      },
    },
    {
      title: 'ยอดชำระ',
      dataIndex: 'ordTotal',
      align: 'center',
      render: (text, record) => {
        return (
          <p>
            <NumberFormat
              value={text}
              decimalScale={2}
              fixedDecimalScale={true}
              decimalSeparator="."
              displayType={'text'}
              thousandSeparator={true}
              suffix={' บาท'}
            />
          </p>
        );
      },
    },
    {
      title: 'วัน/เดือน/ปี ที่สั่งซื้อ',
      dataIndex: 'createTimestamp',
      align: 'center',
      sorter: {
        compare: (a, b) =>
          moment(b.createTimestamp).valueOf() -
          moment(a.createTimestamp).valueOf(),
      },
      render: (text, record) => {
        return (
          <div>
            <p>{moment(text).locale('th').format('LLL')}</p>
          </div>
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'ordStatus',
      align: 'center',
      render: (text, record) => {
        var status = text;
        var message;
        if (status === 0) message = 'กำลังดำเนินการ';
        if (status === 1) message = 'เสร็จสิ้น';
        if (status === 2) message = 'ยกเลิก';
        return (
          <div>
            <p>{message}</p>
          </div>
        );
      },
    },
  ];
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
            <Breadcrumb.Item active>ประวัติออเดอร์</Breadcrumb.Item>
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
          <div className="table-settings mb-3">
            <Row>
              <Col xs={8} md={5}>
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
              <Col xs={4} md={3}>
                <Form.Group>
                  <Form.Select
                    value={option}
                    onChange={e => setOption(e.target.value)}>
                    <option value="">ทั้งหมด</option>
                    {branchData.map((item, index) => (
                      <option key={index} value={item.brId}>
                        {item.brName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md="4">
                <RangePicker
                  locale={locale}
                  size="large"
                  value={pickDate}
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
            </Row>

            <Row>
              <div>
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
                    float: 'right',
                  }}>
                  เคลียร์ค้นหา
                </a>
              </div>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            dataSource={
              keyword != '' || pickDate.length > 0 || option != ''
                ? filterData
                : record
            }
            columns={header}
            rowKey="receipt_id"
            pagination={{ pageSize: 20 }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default OrderHistory;
