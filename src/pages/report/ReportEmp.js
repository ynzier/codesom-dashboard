import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Routes } from 'routes';
import moment from 'moment-timezone';
import 'moment/locale/th';
import { Row, Col, Breadcrumb, Card } from 'react-bootstrap';
import { Table } from 'antd';
import TokenService from 'services/token.service';
import employeeService from 'services/employee.service';

const ReportEmp = props => {
  const { selectBranch } = props;
  const { promiseInProgress } = usePromiseTracker();

  const [reportData, setReportData] = useState([]);
  const fetchData = async branchId => {
    await employeeService
      .empTodayReport(branchId)
      .then(res => {
        setReportData(res.data.querySignCheck);
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
  };
  useEffect(async () => {
    document.title = 'รายงานข้อมูลพนักงาน';

    const role = await TokenService.getUser().authPayload.roleId;
    if (role == 1) {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchData());
          }, 500);
        }),
      );
    }
    return () => {};
  }, []);
  useEffect(async () => {
    if (selectBranch != null) {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetchData(selectBranch));
          }, 500);
        }),
      );
    }
    return () => {};
  }, [selectBranch]);
  const expandedRowRender = records => {
    const columns = [
      {
        title: 'ชื่อ-นามสกุล',
        width: '40%',
        render: (text, record) => (
          <span style={{ overflow: 'hidden' }}>
            {record.firstName} {record.lastName}
          </span>
        ),
      },
      {
        title: 'เวลาเข้างาน',
        render: (text, record) =>
          record.attendances.length ? (
            moment(record.attendances[0].checkInTime).locale('th').format('LLL')
          ) : (
            <span style={{ color: '#d4d4d4' }}>ยังไม่มีการลงชื่อ</span>
          ),
      },
      {
        title: 'เวลาออกงาน',
        render: (text, record) =>
          record.attendances.length && record.attendances[0].checkOutTime ? (
            moment(record.attendances[0].checkOutTime)
              .locale('th')
              .format('LLL')
          ) : (
            <span style={{ color: '#d4d4d4' }}>ยังไม่มีการลงชื่อ</span>
          ),
      },
    ];
    return (
      <Table
        columns={columns}
        dataSource={records.employeeInBranch}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: 'ชื่อสาขา',
      dataIndex: 'branchName',
      key: 'branchName',
      width: '80%',
    },
    {
      title: 'การทำงาน',
      dataIndex: 'working',
      key: 'working',
      align: 'center',
      render: (text, record) =>
        record.working > 0 ? (
          <div>
            {text}/{record.members}
          </div>
        ) : (
          <div>
            <span style={{ color: 'red' }}>{text}</span>/{record.members}
          </div>
        ),
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
            <Breadcrumb.Item active>รายงานข้อมูลพนักงาน</Breadcrumb.Item>
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
                <h2>รายงานข้อมูลพนักงาน</h2>
                <Row style={{ height: '100%' }} className="mb-3">
                  <Table
                    columns={columns}
                    expandable={{ expandedRowRender }}
                    dataSource={reportData}
                    loading={promiseInProgress}
                    pagination={{ pageSize: 20, showSizeChanger: false }}
                  />
                </Row>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default ReportEmp;
