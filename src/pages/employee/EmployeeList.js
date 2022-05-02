import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Breadcrumb, Modal } from 'react-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Routes } from 'routes';
import { Table, Input, Button } from 'antd';
import { useAlert } from 'react-alert';

import 'antd/dist/antd.min.css';

import EmployeeService from 'services/employee.service';
const EmployeeList = props => {
  const { selectBranch } = props;
  let location = useLocation();

  let history = useHistory();
  const alert = useAlert();

  const [records, setRecord] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [filterData, setfilterData] = useState();
  const search = value => {
    const filterTable = records.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setfilterData(filterTable);
  };

  const openRecord = empId => {
    history.push('/dashboard/employee/getEmployee/' + empId);
  };
  const refreshList = () => {
    EmployeeService.getEmployeeList()
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

  useEffect(() => {
    document.title = 'รายชื่อพนักงานทั้งหมด';
    let mounted = true;
    if (!location.state?.isManager)
      EmployeeService.getEmployeeList()
        .then(res => {
          if (mounted) {
            setRecord(res.data);
          }
        })
        .catch(e => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) ||
            e.message ||
            e.toString();
          alert.show(resMessage, { type: 'error' });
        });
    return () => (mounted = false);
  }, []);
  useEffect(() => {
    if (selectBranch) {
      EmployeeService.getEmployeeBranch(selectBranch)
        .then(res => {
          setRecord(res.data);
        })
        .catch(e => {
          const resMessage =
            (e.response && e.response.data && e.response.data.message) ||
            e.message ||
            e.toString();
          alert.show(resMessage, { type: 'error' });
        });
    }

    return () => {};
  }, [selectBranch]);

  const deleteRecord = () => {
    EmployeeService.deleteEmp(deleteData.empId)
      .then(response => {
        refreshList();
        alert.show(response.data.message, { type: 'success' });
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
  const header = [
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'empId',
      align: 'center',
      width: 200,
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
      title: 'ตำแหน่ง',
      dataIndex: 'roleName',
      align: 'center',
      width: 300,
    },
    {
      title: 'สาขา',
      dataIndex: 'branchName',
      align: 'center',
      width: 300,
    },
    {
      title: 'Action',
      width: 300,
      align: 'center',
      render: (text, record) => {
        return (
          <>
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                const empId = record.empId;
                openRecord(empId);
              }}>
              <i className="far fa-edit action mr-2"></i>
            </a>

            <span>&nbsp;&nbsp;</span>
            <a
              href=""
              onClick={e => {
                e.preventDefault();
                setDeleteData(record);
                setModalShow(true);
              }}>
              <i className="fas fa-trash action" />
            </a>
          </>
        );
      },
    },
  ];
  const headerManager = [
    {
      title: 'รหัสพนักงาน',
      dataIndex: 'empId',
      align: 'center',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'firstName',
      align: 'center',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'lastName',
      align: 'center',
    },
    { title: 'เบอร์โทร', dataIndex: 'tel', align: 'center' },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'roleName',
      align: 'center',
    },
  ];

  const DeleteModal = props => {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>ลบข้อมูลพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ข้อมูลของพนักงานที่ต้องการลบ</p>
          <p>
            ชื่อ: {deleteData.firstName} {deleteData.lastName}
          </p>
          <p>ตำแหน่ง: {deleteData.roleName}</p>
          <p>สาขา: {deleteData.branchName}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="primary"
            danger
            ghost
            onClick={() => {
              setModalShow(false);
              deleteRecord();
            }}>
            ลบข้อมูล
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
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
            <Breadcrumb.Item active>พนักงาน</Breadcrumb.Item>
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
                placeholder="ค้นหาพนักงาน"
              />
            </Col>
            <Col md={1} lg={2} xl={4} />
            <Col xs={4} md={5} lg={4} xl={2}>
              {!location.state?.isManager && (
                <Button
                  type="primary"
                  onClick={() => {
                    history.push(Routes.CreateNewEmployee.path);
                  }}>
                  เพิ่มข้อมูลพนักงาน
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body
          className="pt-0"
          style={{ marginTop: 30, height: '100%', width: '100%' }}>
          <Table
            dataSource={filterData == null ? records : filterData}
            columns={location.state?.isManager ? headerManager : header}
            rowKey="empId"
            pagination={{ pageSize: 20, showSizeChanger: false }}
            style={{ fontFamily: 'Prompt' }}
          />
        </Card.Body>
      </Card>
      <DeleteModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
    </>
  );
};
export default EmployeeList;
