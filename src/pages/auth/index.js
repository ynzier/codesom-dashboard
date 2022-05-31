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
import './index.css';
import { useAlert } from 'react-alert';
import { Oval } from 'react-loader-spinner';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';

const Login = ({ ...props }) => {
  const alert = useAlert();
  const { promiseInProgress } = usePromiseTracker({
    area: AuthService.area.signinDashboard,
    delay: 300000,
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    document.title = 'Log In';
  }, []);

  const handleLogin = async e => {
    e.preventDefault();

    await trackPromise(
      AuthService.signinDashboard(username, password)
        .then(() => {
          props.history.push('/dashboard/report/salereport');
          window.location.reload();
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
      AuthService.area.signinDashboard,
    );
  };

  return (
    <>
      <Container className="d-flex container">
        <Row
          className="justify-content-center  align-items-center w-100"
          style={{ margin: 0 }}>
          <Col
            xs={6}
            className="d-flex justify-content-center align-items-center"
            style={{ backgroundColor: '#9D7463', minHeight: '100vh' }}>
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
            style={{
              minHeight: '100vh',
              backgroundColor: 'rgba(249, 220, 194, 0.5)',
            }}>
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
                        style={{ color: '#9D7463' }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      autoFocus
                      type="text"
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
                          style={{ color: '#9D7463' }}
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

                    borderWidth: 0,
                  }}>
                  {promiseInProgress ? (
                    <Oval color="#00BFFF" height={80} width={80} />
                  ) : (
                    'เข้าสู่ระบบ'
                  )}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Login;
