import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Table, DatePicker, Popover, Input, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { Routes } from 'routes';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { Col, Row, Form, Card, Breadcrumb, InputGroup } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import NumberFormat from 'react-number-format';
import BranchesService from 'services/branches.service';
import deliveryService from 'services/delivery.service';
const { Option } = Select;

var getBranchData = [];
const DeliveryHistory = props => {
  const { RangePicker } = DatePicker;
  let history = useHistory();
  let location = useLocation();
  const { selectBranch } = props;

  const [record, setRecord] = useState([]);
  const [branchData, setbranchData] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState(undefined);
  const [pickDate, setPickDate] = useState([]);
  useEffect(async () => {
    var filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == undefined && pickDate.length < 1)
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != undefined && pickDate.length < 1)
        return obj.branchId == option;
      // date
      if (keyword == '' && option == undefined && pickDate.length > 0)
        return (
          moment(obj.createTimestamp).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.createTimestamp).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option
      if (keyword != '' && option != undefined && pickDate.length < 1)
        return (
          obj.branchId == option &&
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          )
        );
      // keyword date
      if (keyword != '' && option == undefined && pickDate.length > 0)
        return (
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          ) &&
          moment(obj.createTimestamp).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.createTimestamp).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // option date
      if (keyword == '' && option != undefined && pickDate.length > 0)
        return (
          obj.branchId == option &&
          moment(obj.createTimestamp).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.createTimestamp).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option date
      if (keyword != '' && option != undefined && pickDate.length > 0)
        return (
          obj.branchId == option &&
          moment(obj.createTimestamp).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.createTimestamp).unix() <=
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
    if (!selectBranch) {
      deliveryService
        .getDeliveryList()
        .then(res => setRecord(res.data))
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(error);
          alert.show(resMessage, { type: 'error' });
        });
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
          console.log(error);
          alert.show(resMessage, { type: 'error' });
        });
    }
    return () => {
      mounted = false;
    };
  }, []);
  useEffect(() => {
    if (selectBranch)
      deliveryService
        .getDeliveryListBranch(selectBranch)
        .then(res => setRecord(res.data))
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(error);
          alert.show(resMessage, { type: 'error' });
        });

    return () => {};
  }, [selectBranch]);

  const openRecord = id => {
    history.push('/dashboard/history/GetOrder/' + id);
  };

  const header = [
    {
      title: 'รหัสรายการ',
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      sorter: {
        compare: (a, b) => b.orderId - a.orderId,
      },
      render: text => {
        return (
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              openRecord(text);
            }}>
            {text}
          </a>
        );
      },
    },
    {
      title: 'สาขา',
      dataIndex: 'branchName',
      align: 'center',
    },
    {
      title: 'ยอดเงิน',
      dataIndex: 'receiptTotal',
      align: 'center',
      render: text => {
        return (
          <NumberFormat
            value={text}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix={' บาท'}
          />
        );
      },
    },
    {
      title: 'เบอร์ติดต่อ',
      dataIndex: 'recipientTel',
      align: 'center',
      render: (text, record) => (
        <Popover
          content={
            <div style={{ fontFamily: 'Prompt', width: 300 }}>
              <p style={{ fontSize: 14 }}>
                ที่อยู่: {record.lalamove?.recipientAddr}
              </p>
              <div style={{ display: 'flex' }}>
                <p style={{ fontSize: 14, marginRight: 4 }}>Tracking: </p>
                <a
                  href={record.lalamove?.shareLink}
                  target="_blank"
                  rel="noreferrer">
                  {record.lalamove?.lalamoveOrderId}
                </a>
              </div>
            </div>
          }
          title={
            <span
              style={{ fontFamily: 'Prompt', fontWeight: 500, fontSize: 16 }}>
              คุณ{record.lalamove?.recipientName}
            </span>
          }
          trigger="click"
          style={{ fontFamily: 'Prompt' }}>
          <a href="">{text}</a>
        </Popover>
      ),
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
      render: text => {
        return moment(text).locale('th').format('LLL');
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'transportStatus',
      align: 'center',
    },
  ];
  const headerManager = [
    {
      title: 'รหัสรายการ',
      dataIndex: 'orderId',
      key: 'orderId',
      align: 'center',
      sorter: {
        compare: (a, b) => b.orderId - a.orderId,
      },
      render: text => {
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
      title: 'ยอดเงิน',
      dataIndex: 'receiptTotal',
      align: 'center',
      render: text => {
        return (
          <NumberFormat
            value={text}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
            suffix={' บาท'}
          />
        );
      },
    },
    {
      title: 'เบอร์ติดต่อ',
      dataIndex: 'recipientTel',
      align: 'center',
      render: (text, record) => (
        <Popover
          content={
            <div style={{ fontFamily: 'Prompt', width: 300 }}>
              <p style={{ fontSize: 14 }}>
                ที่อยู่: {record.lalamove.recipientAddr}
              </p>
              <p style={{ fontSize: 14 }}>
                Tracking:{' '}
                <a
                  href={record.lalamove.shareLink}
                  target="_blank"
                  rel="noreferrer">
                  {record.lalamove.lalamoveOrderId}
                </a>
              </p>
            </div>
          }
          title={
            <span
              style={{ fontFamily: 'Prompt', fontWeight: 500, fontSize: 16 }}>
              คุณ{record.lalamove.recipientName}
            </span>
          }
          trigger="click"
          style={{ fontFamily: 'Prompt' }}>
          <a>{text}</a>
        </Popover>
      ),
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
      render: text => {
        return moment(text).locale('th').format('LLL');
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'transportStatus',
      align: 'center',
    },
  ];
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
              <Col xs={8} md={selectBranch ? 6 : 5}>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder={
                    !selectBranch
                      ? 'ค้นหารหัส/สถานะ/เบอร์ติดต่อ/สาขา'
                      : 'ค้นหารหัส/สถานะ/เบอร์ติดต่อ'
                  }
                />
              </Col>
              {!selectBranch && (
                <Col xs={4} md={3}>
                  <Select
                    className="mb-3"
                    showSearch
                    allowClear
                    style={{
                      width: '100%',
                      fontFamily: 'Prompt',
                    }}
                    placeholder="สถานะ"
                    value={option}
                    optionFilterProp="children"
                    dropdownStyle={{ fontFamily: 'Prompt' }}
                    onChange={value => {
                      setOption(value);
                    }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }>
                    {branchData.map((item, index) => (
                      <Option key={index} value={item.branchId}>
                        {item.branchName}
                      </Option>
                    ))}
                  </Select>
                </Col>
              )}
              <Col md={selectBranch ? 6 : 4}>
                <RangePicker
                  locale={locale}
                  value={pickDate}
                  disabledDate={current => {
                    return moment() < current;
                  }}
                  ranges={{
                    วันนี้: [moment().startOf('day'), moment().endOf('day')],
                    เดือนนี้: [
                      moment().startOf('month'),
                      moment().endOf('month'),
                    ],
                  }}
                  style={{
                    borderRadius: '10px',
                    fontFamily: 'Prompt',
                  }}
                  popupStyle={{ fontFamily: 'Prompt' }}
                  onChange={date => {
                    if (!date) return setPickDate([]);
                    setPickDate(date);
                  }}
                />
              </Col>
            </Row>

            <Row>
              <div>
                <a
                  onClick={() => {
                    if (!location.state?.isManager) {
                      setKeyword('');
                      setOption(undefined);
                      setPickDate([]);
                    } else {
                      setPickDate([]);
                    }
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
              keyword != '' || pickDate.length > 0 || option != undefined
                ? filterData
                : record
            }
            columns={location.state?.isManager ? headerManager : header}
            rowKey="orderId"
            showSizeChanger={false}
            pagination={{ pageSize: 20, showSizeChanger: false }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default DeliveryHistory;
