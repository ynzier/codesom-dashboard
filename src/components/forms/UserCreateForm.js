import React, { useState } from 'react';
import { Col, Row, Card, Form, Button, InputGroup } from 'react-bootstrap';

// services
import EmployeeService from 'services/employee.service';
import UserService from 'services/users.service';

const UserCreateForm = ({ generate }) => {
  const initialRecordState = {
    userName: '',
    password: '',
    confirmPassword: '',
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [empId, setEmpId] = useState('');
  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setEmpId(onlyDigits);
  };
  const [validEmpId, setValidEmpId] = useState('');
  const [record, setRecord] = useState(initialRecordState);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setRecord({
      ...record,
      [name]: value,
    });
  };

  const form = document.forms[0];

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const sendData = async () => {
    var data = {
      userName: record.userName,
      password: record.password,
      confirmPassword: record.confirmPassword,
      empId: validEmpId,
      firstName: firstName,
      lastName: lastName,
      createdBy: '0', //on start
    };
    console.log(data);
    await UserService.createNewUser(data)
      .then(response => {
        generate('success', response.data.message);
        form.reset();
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

  return (
    <>
      <Card
        border="light"
        className="bg-white px-6 py-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
        }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">เพิ่มผู้ใช้งานใหม่</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="firstname">
                  <Form.Label>รหัสพนักงาน</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="tel"
                      maxLength="10"
                      value={empId}
                      autoComplete="new-password"
                      placeholder="รหัสพนักงาน"
                      onChange={e => checkInput(e)}
                    />
                    <Button
                      variant="outline-codesom"
                      style={{ zIndex: 5 }}
                      onClick={e => {
                        EmployeeService.getEmployeeByIdForUserCreate(empId)
                          .then(response => {
                            const RecievedData = response && response.data;
                            generate('success', response.data.message);
                            setFirstName(RecievedData.resData[0].first_name);
                            setLastName(RecievedData.resData[0].last_name);
                            setValidEmpId(empId);
                            e.disabled = true;
                          })
                          .catch(error => {
                            const resMessage =
                              (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                              error.message ||
                              error.toString();
                            setFirstName('');
                            setLastName('');
                            generate('danger', resMessage);
                          });
                      }}>
                      ค้นหา
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <div></div>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="firstname">
                  <Form.Label>ชื่อ</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    placeholder="ชื่อ"
                    name="firstName"
                    value={firstName}
                  />
                </Form.Group>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="lastname">
                  <Form.Label>นามสกุล</Form.Label>
                  <Form.Control
                    disabled
                    type="text"
                    placeholder="นามสกุล"
                    name="lastName"
                    value={lastName}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="firstname">
                  <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="ชื่อผู้ใช้งาน"
                    name="userName"
                    autoComplete="new-password"
                    maxLength="40"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="password">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="รหัสผ่าน"
                    name="password"
                    maxLength="40"
                    autoComplete="off"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="password">
                  <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="ยืนยันรหัสผ่าน"
                    name="confirmPassword"
                    maxLength="40"
                    autoComplete="off"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} />
              <Col sm={3} md={3}>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    setEmpId('');
                    setValidEmpId('');
                    setFirstName('');
                    setLastName('');
                    form.reset();
                  }}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  ล้างข้อมูล
                </Button>
              </Col>
              <Col sm={3} md={3}>
                <Button
                  variant="tertiary"
                  type="submit"
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    color: 'white',
                  }}>
                  บันทึกข้อมูล
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserCreateForm;
