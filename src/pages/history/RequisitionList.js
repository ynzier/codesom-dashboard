import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table, DatePicker, Input, Select } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Breadcrumb } from 'react-bootstrap';
import { Routes } from 'routes';
import { IngrStffCreateModal } from 'components';
import requisitionService from 'services/requisition.service';
const { Option } = Select;

const RequisitionList = props => {
  let history = useHistory();
  const { selectBranch } = props;
  const alert = useAlert();
  const { RangePicker } = DatePicker;
  const { promiseInProgress } = usePromiseTracker({
    area: requisitionService.area.listAllReq,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState(undefined);
  const [pickDate, setPickDate] = useState([]);

  useEffect(async () => {
    const filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == undefined && pickDate.length < 1)
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != undefined && pickDate.length < 1)
        return obj.requisitionStatus == option;
      // date
      if (keyword == '' && option == undefined && pickDate.length > 0)
        return (
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option
      if (keyword != '' && option != undefined && pickDate.length < 1)
        return (
          obj.requisitionStatus == option &&
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
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // option date
      if (keyword == '' && option != undefined && pickDate.length > 0)
        return (
          obj.requisitionStatus == option &&
          moment(obj.updatedAt).unix() >=
            moment(pickDate[0]).startOf('day').unix() &&
          moment(obj.updatedAt).unix() <=
            moment(pickDate[1]).endOf('day').unix()
        );
      // keyword option date
      if (keyword != '' && option != undefined && pickDate.length > 0)
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
    history.push('/dashboard/history/getRequisition/' + reqId);
  };
  const fetchData = useCallback(async id => {
    if (id != null) {
      await trackPromise(
        requisitionService
          .listAllReqByBranch(id)
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
    } else {
      await trackPromise(
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
    }
  });
  useEffect(async () => {
    document.title = 'ประวัติการเบิกจ่ายสินค้า';
    if (selectBranch == null) fetchData();
    if (selectBranch != null) fetchData(selectBranch);
    return () => {};
  }, []);

  useEffect(() => {
    if (selectBranch != null) fetchData(selectBranch);

    return () => {};
  }, [selectBranch]);
  const header = [
    {
      title: 'No.',
      dataIndex: 'requisitionId',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return (
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              const requisitionId = record.requisitionId;
              openRecord(requisitionId);
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
      width: 200,
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
      render: text => {
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
  const headerManager = [
    {
      title: 'No.',
      dataIndex: 'requisitionId',
      align: 'center',
      width: 120,
      render: (text, record) => {
        return (
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              const requisitionId = record.requisitionId;
              openRecord(requisitionId);
            }}>
            {text}
          </a>
        );
      },
    },
    {
      title: 'ผู้ทำรายการ',
      dataIndex: 'creatorName',
      align: 'center',
      width: 200,
    },
    {
      title: 'จำนวน',
      dataIndex: 'itemCount',
      align: 'center',
      width: 100,
    },
    {
      title: 'อัพเดทล่าสุดเมื่อ',
      dataIndex: 'updatedAt',
      align: 'center',
      width: 250,
      render: (text, record) => {
        return <div>{moment(record.updatedAt).locale('th').format('LLL')}</div>;
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'requisitionStatus',
      align: 'center',
      width: 150,
      render: text => {
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
            <Breadcrumb.Item href={Routes.Home.path}>
              <FontAwesomeIcon icon={faHome} />
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
          fontFamily: 'Prompt',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings ">
            <Row>
              <Col xs={8} md={5}>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder={
                    selectBranch != null ? 'ค้นหารหัส' : 'ค้นหารหัส/ชื่อสาขา'
                  }
                />
              </Col>
              <Col xs={4} md={3}>
                <Select
                  style={{
                    width: '100%',
                    fontFamily: 'Prompt',
                  }}
                  placeholder="สถานะ"
                  value={option}
                  dropdownStyle={{ fontFamily: 'Prompt' }}
                  onChange={value => {
                    setOption(value);
                  }}>
                  <Option value="0">รออนุมัติ</Option>
                  <Option value="1">อนุมัติแล้ว</Option>
                  <Option value="2">กำลังดำเนินการ</Option>
                  <Option value="3">เสร็จสิ้น</Option>
                  <Option value="4">ยกเลิก</Option>
                </Select>
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
                    setKeyword('');
                    setOption(undefined);
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
              keyword != '' || pickDate.length > 0 || option != undefined
                ? filterData
                : record
            }
            columns={selectBranch != null ? headerManager : header}
            rowKey="requisitionId"
            loading={promiseInProgress}
            showSizeChanger={false}
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
export default RequisitionList;
