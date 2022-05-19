import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUserCircle,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { Nav, Navbar, Dropdown, Container, Modal } from 'react-bootstrap';
import { Form, Input, Button } from 'antd';
import AuthService from 'services/auth.service';
import tokenService from 'services/token.service';
import usersService from 'services/users.service';

const SettingModal = ({ setModalShow, ...props }) => {
  const [form] = Form.useForm();
  const [userName, setUserName] = useState('');
  const [empId, setEmpId] = useState();
  const alert = useAlert();

  const handleSubmit = async e => {
    const data = { password: e.password, confirmPassword: e.confirmPassword };
    await usersService
      .updateUser(empId, data)
      .then(res => {
        alert.show(res.data.message, { type: 'success' });
        setModalShow(false);
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
    const user = await tokenService.getUser();
    setEmpId(user.authPayload.empId);
    await usersService
      .getUsername(user.authPayload.empId)
      .then(res => {
        setUserName(res.data.userName);
        form.resetFields();
      })
      .catch(err => console.log(err));

    return () => {};
  }, []);

  return (
    <Modal {...props} onShow={() => {}}>
      <Modal.Header closeButton>
        <Modal.Title>ตั้งค่ารหัสผ่าน</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 mt-3" style={{ fontFamily: 'Prompt' }}>
        <Form
          name="settingForm"
          form={form}
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}>
          <Form.Item
            label="ชื่อผู้ใช้งาน"
            name="username"
            initialValue={userName}>
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[
              { required: true, message: 'กรอกรหัสผ่าน!' },
              { max: 16, message: 'ไม่เกิน 16 ตัวอักษร' },
              { min: 8, message: 'รหัสผ่านต้องมากกว่า 7 ตัวอักษร' },
            ]}>
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item
            label="ยืนยันรหัสผ่าน"
            name="confirmPassword"
            rules={[
              { required: true, message: 'กรอกรหัสผ่าน!' },
              { max: 16, message: 'ไม่เกิน 16 ตัวอักษร' },
              { min: 8, message: 'รหัสผ่านต้องมากกว่า 7 ตัวอักษร' },
            ]}>
            <Input.Password placeholder="********" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 18, span: 6 }}>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
          </Form.Item>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
const NavbarComponent = () => {
  const [modalShow, setModalShow] = useState(false);
  const logOut = () => {
    AuthService.logoutDashboard();
  };

  return (
    <>
      {modalShow && (
        <SettingModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
          setModalShow={setModalShow}
        />
      )}
      <Navbar
        variant="dark"
        expanded
        className="ps-0 pe-2 pb-0"
        style={{ float: 'right', fontFamily: 'Prompt' }}>
        <Container fluid className="px-0 d-flex justify-content-between w-100">
          <div className="d-flex align-items-center"></div>
          <Nav className="align-items-center">
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="user-avatar md-avatar rounded-circle2"
                    style={{ color: 'gray' }}
                  />
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item
                  onClick={() => setModalShow(true)}
                  className="fw-bold">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  ตั้งค่าบัญชี
                </Dropdown.Item>
                <Dropdown.Item
                  className="fw-bold"
                  onClick={() => {
                    logOut();
                    window.location = '/';
                  }}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
