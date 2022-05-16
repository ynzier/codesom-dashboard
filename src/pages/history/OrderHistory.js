import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Table, DatePicker, Input, Select } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { Routes } from 'routes';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { Col, Row, Card, Breadcrumb } from 'react-bootstrap';
import 'antd/dist/antd.min.css';
import NumberFormat from 'react-number-format';
import { useAlert } from 'react-alert';
import historyService from 'services/history.service';
import BranchesService from 'services/branches.service';
const { Option } = Select;

var getBranchData = [];
const OrderHistory = props => {
  const { RangePicker } = DatePicker;
  let history = useHistory();
  let location = useLocation();
  const { selectBranch } = props;
  const alert = useAlert();
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
    document.title = 'ประวัติออเดอร์';
    let mounted = true;
    if (selectBranch == null) {
      historyService
        .listOrderDashboard()
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
    if (selectBranch != null)
      historyService
        .listOrderDashboardByBranch(selectBranch)
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
      title: 'ประเภท',
      dataIndex: 'orderType',
      align: 'center',
    },
    {
      title: 'ยอดชำระ',
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
      dataIndex: 'orderStatus',
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
      title: 'ประเภท',
      dataIndex: 'orderType',
      align: 'center',
    },
    {
      title: 'ยอดชำระ',
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
      dataIndex: 'orderStatus',
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
          <div className="table-settings">
            <Row>
              <Col xs={8} md={5}>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="ค้นหา"
                />
              </Col>
              <Col xs={4} md={3}>
                {!location.state?.isManager && (
                  <Select
                    showSearch
                    style={{
                      width: '100%',
                      fontFamily: 'Prompt',
                    }}
                    placeholder="เลือกสาขา"
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
                    {branchData.map(option => (
                      <Option key={option.branchId} value={option.branchId}>
                        {option.branchName}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
              <Col md="4">
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
                      setKeyword('');
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
            columns={selectBranch != null ? headerManager : header}
            rowKey="orderId"
            showSizeChanger={false}
            pagination={{ pageSize: 20, showSizeChanger: false }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default OrderHistory;
