import React, { useState } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { useAlert } from 'react-alert';
// services
import { Form, Input, Button as ButtonA } from 'antd';
import EmployeeService from 'services/employee.service';
import UserService from 'services/users.service';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
const { Search } = Input;

const UserCreateForm = () => {
  const alert = useAlert();
  const [form] = Form.useForm();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [found, setFound] = useState(false);

  const [empId, setEmpId] = useState('');
  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setEmpId(onlyDigits);
  };
  const [validEmpId, setValidEmpId] = useState('');

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
          history.back();
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
            <h2 className="mb-4">เพิ่มผู้ใช้งาน</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Search
                  placeholder="รหัสพนักงาน"
                  disabled={found}
                  value={empId}
                  onChange={e => checkInput(e)}
                  onSearch={() => {
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
                        setFound(true);
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
                  }}
                  style={{ width: '100%' }}
                />
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
                  label="ยืนยันรหัสผ่าน"
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
                <ButtonA
                  danger
                  ghost
                  onClick={() => {
                    setFound(false);
                    setEmpId('');
                    setFirstName('');
                    setLastName('');
                    form.resetFields();
                    form.setFieldsValue({ firstName: '', lastName: '' });
                  }}>
                  ล้างข้อมูล
                </ButtonA>
              </Col>
              <Col sm={3} md={3}>
                <ButtonA type="primary" htmlType="submit">
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
