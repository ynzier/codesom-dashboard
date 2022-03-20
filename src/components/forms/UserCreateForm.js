import React, { useState } from 'react';
import {
  Col,
  Row,
  Card,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { useAlert } from 'react-alert';
// services
import { Form, Input, Button as ButtonA } from 'antd';
import EmployeeService from 'services/employee.service';
import UserService from 'services/users.service';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const UserCreateForm = () => {
  const alert = useAlert();
  const [form] = Form.useForm();
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

  const sendData = async values => {
    var data = {
      userName: values.userName,
      password: values.password,
      confirmPassword: values.confirmPassword,
      empId: validEmpId,
      firstName: firstName,
      lastName: lastName,
      createdBy: '0', //on start
    };
    await UserService.createNewUser(data)
      .then(res => {
        if (res) {
          alert.show(res.data.message, { type: 'success' });
          form.resetFields();
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
  };

  return (
    <>
      <Card
        border="light"
        className="bg-white px-6 py-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Body>
          <Form
            form={form}
            name="createEmployee"
            preserve={false}
            layout="vertical"
            onFinish={values => {
              sendData(values);
            }}>
            <h2 className="mb-4">เพิ่มผู้ใช้งานใหม่</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <InputGroup>
                  <FormControl
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
                          alert.show(response.data.message, {
                            type: 'success',
                          });
                          setFirstName(RecievedData.resData[0].first_name);
                          setLastName(RecievedData.resData[0].last_name);
                          setValidEmpId(empId);
                          form.resetFields();
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
                          alert.show(resMessage, { type: 'error' });
                        });
                    }}>
                    ค้นหา
                  </Button>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="firstName"
                  label="ชื่อ"
                  initialValue={firstName}
                  rules={[
                    { required: true, message: '*ใส่ชื่อ' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อ" disabled />
                </Form.Item>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="lastName"
                  label="นามสกุล"
                  initialValue={lastName}
                  rules={[
                    { required: true, message: '*ใส่นามสกุล' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="นามสกุล" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="userName"
                  label="ชื่อผู้ใช้งาน"
                  rules={[
                    { required: true, message: '*ใส่ชื่อผู้ใช้งาน (Username)' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อผู้ใช้งาน" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="password"
                  label="รหัสผ่าน"
                  rules={[
                    { required: true, message: '*ใส่รหัสผ่าน' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input.Password
                    placeholder="รหัสผ่าน"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="confirmPassword"
                  label="รหัสผ่าน"
                  rules={[
                    { required: true, message: '*ใส่รหัสผ่าน' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input.Password
                    placeholder="ยืนยันรหัสผ่าน"
                    iconRender={visible =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} />
              <Col sm={3} md={3}>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    form.resetFields();
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
                <ButtonA
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    borderWidth: '0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    backgroundColor: '#2DC678',
                  }}
                  htmlType="submit">
                  บันทึกข้อมูล
                </ButtonA>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserCreateForm;
