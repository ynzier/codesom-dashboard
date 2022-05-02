import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { WarningFilled } from '@ant-design/icons';

import { Col, Row, Card, Breadcrumb } from 'react-bootstrap';
import { useAlert } from 'react-alert';

import { useHistory } from 'react-router-dom';
import { Routes } from 'routes';
import { Table, Popconfirm, Button, Input } from 'antd';

import UserService from 'services/users.service';
import usersService from 'services/users.service';
const UserList = ({ ...props }) => {
  const alert = useAlert();
  let history = useHistory();
  const [records, setRecord] = useState([]);
  const [filterData, setfilterData] = useState();
  const search = value => {
    const filterTable = records.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setfilterData(filterTable);
  };
  const fetchUser = () => {
    UserService.getUserList()
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
      });
  };
  const confirm = id =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(
          usersService
            .deleteUser(id)
            .then(res => {
              alert.show(res.data.message, { type: 'success' });
              fetchUser();
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
        );
      }, 1000);
    });

  useEffect(() => {
    document.title = 'รายชื่อผู้ใช้งานแดชบอร์ด';
    let mounted = true;
    UserService.getUserList()
      .then(res => {
        if (mounted) {
          setRecord(res.data);
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

  const header = [
    {
      title: 'รหัสผู้ใช้งาน',
      dataIndex: 'id',
      align: 'center',
      width: 300,
    },
    {
      title: 'ชื่อผู้ใช้งาน',
      dataIndex: 'userName',
      align: 'center',
      width: 300,
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      align: 'center',
      width: 300,
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastName',
      align: 'center',
      width: 300,
    },
    {
      title: 'ระดับ',
      align: 'center',
      dataIndex: 'role',
      width: 300,
    },
    {
      title: 'Action',
      key: 'key',
      align: 'center',
      dataIndex: 'key',
      render: (text, record) => {
        return (
          <Popconfirm
            icon={<WarningFilled style={{ color: 'red' }} />}
            title={() => (
              <div style={{ fontFamily: 'Prompt' }}>ลบบัญชีผู้ใช้งาน</div>
            )}
            okText="ยืนยัน"
            showCancel={false}
            onConfirm={() => confirm(record.id)}
            okButtonProps={{
              style: { height: 40, background: 'red', borderWidth: 0 },
            }}>
            <a href="" style={{ color: '#646464' }}>
              <i className="fa fa-ban action mr-2" />
            </a>
          </Popconfirm>
        );
      },
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
            <Breadcrumb.Item active>ผู้ใช้งาน</Breadcrumb.Item>
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
          <Row>
            <Col xs={8} md={6} lg={6} xl={6}>
              <Input
                onChange={e => search(e.target.value)}
                placeholder="ค้นหาผู้ใช้งาน"
              />
            </Col>
            <Col md={1} lg={2} xl={4} />
            <Col xs={4} md={5} lg={4} xl={2}>
              <Button
                type="primary"
                onClick={() => {
                  history.push(Routes.AddPermission.path);
                }}>
                เพิ่มผู้ใช้งานใหม่
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body
          className="pt-0"
          style={{ marginTop: 16, height: '100%', width: '100%' }}>
          <Table
            dataSource={filterData == null ? records : filterData}
            columns={header}
            rowKey="id"
            pagination={{ pageSize: 20 }}
            style={{ fontFamily: 'Prompt' }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default UserList;
