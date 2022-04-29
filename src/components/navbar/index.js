import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faUserCircle,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import {
  Nav,
  Navbar,
  Dropdown,
  Container,
  Col,
  Row,
  Form,
  Button,
  Modal,
} from 'react-bootstrap';

import AuthService from 'services/auth.service';
import tokenService from 'services/token.service';
import usersService from 'services/users.service';

const SettingModal = ({ setModalShow, ...props }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [empId, setEmpId] = useState();
  const alert = useAlert();

  const handleSubmit = async e => {
    e.preventDefault();
    const data = { password: password, confirmPassword: confirmPass };
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
      })
      .catch(err => console.log(err));

    return () => {};
  }, []);

  return (
    <Modal {...props} onShow={() => {}}>
      <Modal.Header closeButton>
        <Modal.Title>ตั้งค่ารหัสผ่าน</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 mt-3">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="branchUsername">
            <Form.Label column sm="3">
              ชื่อผู้ใช้
            </Form.Label>
            <Col sm="9">
              <Form.Control disabled type="text" value={userName} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="branchPassword">
            <Form.Label column sm="3">
              รหัสผ่าน
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="branchConfirmPassword">
            <Form.Label column sm="3">
              ยืนยันรหัสผ่าน
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
              />
            </Col>
          </Form.Group>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 4 }} />
            <Button
              variant="tertiary"
              type="submit"
              style={{ color: 'white', flex: 2 }}>
              บันทึกข้อมูล
            </Button>
          </div>
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
      <SettingModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        setModalShow={setModalShow}
      />
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
