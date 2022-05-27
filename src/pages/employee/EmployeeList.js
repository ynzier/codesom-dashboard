import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Breadcrumb, Modal } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Routes } from 'routes';
import { Table, Input, Button } from 'antd';
import { useAlert } from 'react-alert';

import EmployeeService from 'services/employee.service';
import TokenService from 'services/token.service';
const EmployeeList = props => {
  const { selectBranch } = props;
  let location = useLocation();

  const { promiseInProgress } = usePromiseTracker();
  let history = useHistory();
  const alert = useAlert();

  const [records, setRecord] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isManager, setIsManager] = useState(true);
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
  const refreshList = async () => {
    await trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
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
              }),
          );
        }, 1000);
      }),
    );
  };

  useEffect(() => {
    document.title = 'รายชื่อพนักงาน';
    let mounted = true;
    const fetch = async () => {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              EmployeeService.getEmployeeList()
                .then(res => {
                  if (mounted) {
                    setRecord(res.data);
                  }
                })
                .catch(e => {
                  const resMessage =
                    (e.response &&
                      e.response.data &&
                      e.response.data.message) ||
                    e.message ||
                    e.toString();
                  alert.show(resMessage, { type: 'error' });
                }),
            );
          }, 1000);
        }),
      );
    };
    const user = TokenService.getUser();
    if (user.authPayload.roleId == 1) {
      fetch();
      setIsManager(false);
    }
    return () => (mounted = false);
  }, []);
  useEffect(() => {
    const fetch = async () => {
      await trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              EmployeeService.getEmployeeBranch(selectBranch)
                .then(res => {
                  setRecord(res.data);
                })
                .catch(e => {
                  const resMessage =
                    (e.response &&
                      e.response.data &&
                      e.response.data.message) ||
                    e.message ||
                    e.toString();
                  alert.show(resMessage, { type: 'error' });
                }),
            );
          }, 1000);
        }),
      );
    };
    if (selectBranch != null) fetch();

    return () => {};
  }, [selectBranch]);

  const deleteRecord = async () => {
    await trackPromise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(
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
              }),
          );
        }, 1000);
      }),
    );
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
            <Breadcrumb.Item active>รายชื่อพนักงาน</Breadcrumb.Item>
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
          <Row className="mb-1">
            <Col xs={8} md={6} lg={6} xl={6}>
              <Input
                onChange={e => search(e.target.value)}
                placeholder="ค้นหาพนักงาน"
              />
            </Col>
            <Col md={1} lg={2} xl={4} />
            <Col xs={4} md={5} lg={4} xl={2}>
              {!isManager && (
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
          style={{ marginTop: 16, height: '100%', width: '100%' }}>
          <Table
            dataSource={filterData == null ? records : filterData}
            columns={isManager ? headerManager : header}
            rowKey="empId"
            loading={promiseInProgress}
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
