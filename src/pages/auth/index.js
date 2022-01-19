/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Form,
  Button,
  Container,
  InputGroup,
  Image,
} from 'react-bootstrap';
import Logo from 'assets/Codesom-Logo-x400.png';
import AuthService from 'services/auth.service';
import styles from './index.css';

const App = () => {
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    document.title = 'Log In';
  }, []);

  const handleLogin = e => {
    e.preventDefault();

    AuthService.login(Username, Password).then(
      () => {
        // window.location.reload();
        history.push('/dashboard');
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      },
    );
  };

  return (
    <Container className="d-flex container">
      <Row
        className="justify-content-center  align-items-center w-100"
        style={{ margin: 0 }}>
        <Col
          xs={6}
          className="d-flex justify-content-center align-items-center"
          style={{ backgroundColor: '#FF9C00', minHeight: '100vh' }}>
          <div className="logoBox">
            <Image src={Logo} className="logo" />
            <div className="text-center text-md-center mb-4 mt-md-0">
              <h5 className="mb-0">Supply Manangement System</h5>
            </div>
          </div>
        </Col>
        <Col
          xs={6}
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '100vh', backgroundColor: '#FFE9D4' }}>
          <div className="loginBox">
            <div className="text-center text-md-center mb-4 mt-md-3">
              <h3 className="mb-0">เข้าสู่ระบบเพื่อใช้งาน</h3>
            </div>
            <Form className="mt-4" onSubmit={handleLogin}>
              <Form.Group id="username" className="mb-2">
                <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: '#FF9C00' }}
                    />
                  </InputGroup.Text>
                  <Form.Control
                    autoFocus
                    required
                    type="email"
                    placeholder="กรอกชื่อผู้ใช้งาน"
                    onChange={e => setUsername(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Group id="password" className="mb-4">
                  <Form.Label>รหัสผ่าน</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon
                        icon={faUnlockAlt}
                        style={{ color: '#FF9C00' }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="password"
                      placeholder="กรอกรหัสผ่าน"
                      onChange={e => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Group>
              <Button
                variant="tertiary"
                type="submit"
                className="w-100 shadow-5 mb-2"
                style={{
                  color: 'white',
                  boxShadow: '1px 3px 1px #CFCFCF',
                  backgroundColor: '#FF9C00',
                  borderWidth: 0,
                }}>
                เข้าสู่ระบบ
              </Button>
              {message && (
                <div style={{ color: 'red' }} role="alert">
                  {message}
                </div>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default App;
