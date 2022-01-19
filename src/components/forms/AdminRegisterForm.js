import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Modal,
  Alert,
} from 'react-bootstrap';

import AuthService from 'services/auth.service';

var getData = [];

const AdminRegisterForm = () => {
  const initialRecordState = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [roleData, setRoleData] = useState([]);

  const [roleID, setRoleID] = useState('');
  const [record, setRecord] = useState(initialRecordState);
  const [status, setStatus] = useState(0);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setRecord({ ...record, [name]: value });
  };

  useEffect(() => {
    document.title = 'Admin Dashboard / ผู้ดูแลระบบ';
    let mounted = true;
    AuthService.getAllRole()
      .then(res => {
        if (mounted) {
          getData = res.data;
          setRoleData(getData);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
    return () => (mounted = false);
  }, []);

  const form = document.forms[0];
  const MyVerticallyCenteredModal = props => {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลผู้ใช้งาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ชื่อ - นามสกุล: {record.firstName} {record.lastName}
          </p>
          <p>ชื่อผู้ใช้งาน: {record.username}</p>
        </Modal.Body>
        <Modal.Footer>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Button variant="primary" onClick={sendData}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(roleID);
    setModalShow(true);
  };

  const sendData = () => {
    var data = {
      firstName: record.firstName,
      lastName: record.lastName,
      username: record.username,
      role_id: roleID,
      password: record.password,
    };
    AuthService.register(data)
      .then(response => {
        setModalShow(false);
        setStatus(1);
        form.reset();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <h5 className="my-4">ข้อมูลผู้ใช้งาน / User Info</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="address">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="อีเมลล์"
                  name="username"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="password">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="รหัสผ่าน"
                  name="password"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="address">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="ชื่อ"
                  name="firstName"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group id="address">
                <Form.Label>นามสกุล</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="นามสกุล"
                  name="lastName"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="role_id">
                <Form.Label>ตำแหน่ง</Form.Label>
                <Form.Select required onChange={e => setRoleID(e.target.value)}>
                  <option>เลือกตำแหน่ง</option>
                  {roleData.map(option => (
                    <option key={option.role_id} value={option.role_id}>
                      {option.roleName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={2}>
              <div>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ height: 55, width: '100%' }}>
                  Add
                </Button>
              </div>
            </Col>
            <Col md={5}>
              {status === 1 ? (
                <Alert
                  variant="success"
                  onClose={() => setStatus(0)}
                  dismissible>
                  บันทึกข้อมูลเรียบร้อยแล้ว !
                </Alert>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form>

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setErrorMessage('');
          }}
        />
      </Card.Body>
    </Card>
  );
};

export { AdminRegisterForm };
