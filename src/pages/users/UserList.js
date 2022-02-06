import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Form,
  Card,
  Breadcrumb,
  InputGroup,
  Button,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Routes } from 'routes';
import { Table } from 'antd';

import { AlertList } from 'react-bs-notifier';
import 'antd/dist/antd.min.css';
import './index.css';

import UserService from 'services/users.service';
const UserList = props => {
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

  const openRecord = id => {
    console.log(id);
    props.history.push('/record/' + id);
  };
  const refreshList = () => {
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
        generate('danger', resMessage);
      });
  };

  useEffect(() => {
    document.title = 'รายชื่อผู้ใช้งานแดชบอร์ด';
    let mounted = true;
    UserService.getUserList()
      .then(res => {
        if (mounted) {
          console.log(res.data);
          setRecord(res.data);
        }
      })
      .catch(e => {
        console.log(e);
      });
    return () => (mounted = false);
  }, []);
  const [alerts, setAlerts] = React.useState([]);
  const generate = React.useCallback((type, message) => {
    const headline =
      type === 'danger' ? 'พบข้อผิดพลาด' : type === 'success' ? 'สำเร็จ' : null;
    setAlerts(alerts => [
      ...alerts,
      {
        id: new Date().getTime(),
        type: type,
        headline: `${headline}!`,
        message: message,
      },
    ]);
  }, []);
  const onDismissed = React.useCallback(alert => {
    setAlerts(alerts => {
      const idx = alerts.indexOf(alert);
      if (idx < 0) return alerts;
      return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
    });
  }, []);

  // const deleteRecord = () => {
  //   UserService.deleteEmp(deleteData.emp_id)
  //     .then(response => {
  //       refreshList();
  //       generate('success', response.data.message);
  //       setModalShow(false);
  //     })
  //     .catch(error => {
  //       const resMessage =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //       generate('danger', resMessage);
  //     });
  // };
  const header = [
    {
      title: 'รหัสผู้ใช้งาน',
      dataIndex: 'user_id',
      align: 'center',
      width: 300,
    },
    {
      title: 'ชื่อผู้ใช้งาน',
      dataIndex: 'username',
      align: 'center',
      width: 300,
    },
    {
      title: 'ชื่อ',
      dataIndex: 'first_name',
      align: 'center',
      width: 300,
    },
    {
      title: 'นามสกุล',
      dataIndex: 'last_name',
      align: 'center',
      width: 300,
    },
    {
      title: 'ระดับ',
      dataIndex: 'role_name',
      align: 'center',
      width: 300,
    },
    {
      title: 'Action',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => {
        return (
          <div>
            <span onClick={() => {}}>
              <i className="far fa-edit action mr-2"></i>
            </span>
          </div>
        );
      },
    },
  ];

  // const DeleteModal = props => {
  //   return (
  //     <Modal {...props}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>ลบข้อมูลพนักงาน</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <p>ข้อมูลของพนักงานที่ต้องการลบ</p>
  //         <p>
  //           ชื่อ: {deleteData.first_name} {deleteData.last_name}
  //         </p>
  //         <p>ตำแหน่ง: {deleteData.role_name}</p>
  //         <p>สาขา: {deleteData.br_name}</p>
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button variant="danger" onClick={deleteRecord}>
  //           ลบข้อมูล
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>
  //   );
  // };
  return (
    <>
      <AlertList
        position="top-right"
        alerts={alerts}
        onDismiss={onDismissed}
        timeout={1500}
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
        }}>
        <Card.Header>
          <Row>
            <Col xs={8} md={6} lg={6} xl={6}>
              <InputGroup style={{ height: '50px' }}>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="ค้นหาผู้ใช้งาน"
                  onChange={e => search(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4} lg={2} xl={4} />
            <Col xs={2} md={2} lg={4} xl={2}>
              <Button
                className="w-100"
                as={Link}
                to={Routes.AddPermission.path}
                variant="codesom"
                style={{
                  color: '#fff',
                  height: '50px',
                  paddingTop: '0.75rem',
                  borderRadius: '10px',
                  boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                }}>
                เพิ่มผู้ใช้งานใหม่
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body
          className="pt-0"
          style={{ marginTop: 30, height: '100%', width: '100%' }}>
          <Table
            dataSource={filterData == null ? records : filterData}
            columns={header}
            rowKey="user_id"
            pagination={{ pageSize: 20 }}
            style={{ fontFamily: 'Prompt' }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default UserList;
