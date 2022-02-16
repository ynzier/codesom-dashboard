import React, { useState, useEffect } from 'react';
import { AlertList } from 'react-bs-notifier';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import BranchesService from 'services/branches.service';

const BranchAccDetail = props => {
  const [brId, setBrId] = useState();
  const [authData, setAuthData] = useState();
  const [brName, setBrName] = useState('');
  const [brTel, setBrTel] = useState('');
  const [brUsername, setBrUsername] = useState('');
  const [brPassword, setBrPassword] = useState('');
  const [brConfirmPassword, setBrConfirmPassword] = useState('');
  const [accStatus, setAccStatus] = useState('');
  const [alerts, setAlerts] = React.useState([]);
  const generate = React.useCallback((type, message) => {
    const headline =
      type === 'danger' ? 'ข้อผิดพลาด' : type === 'success' ? 'สำเร็จ' : null;
    setAlerts(alerts => [
      ...alerts,
      {
        id: new Date().getTime(),
        type: type,
        headline: `${headline}!`,
        message: message,
      },
    ]);
  }, []);
  const onDismissed = React.useCallback(alert => {
    setAlerts(alerts => {
      const idx = alerts.indexOf(alert);
      if (idx < 0) return alerts;
      return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
    });
  }, []);
  useEffect(async () => {
    if (props.brId) {
      await BranchesService.getBranchById(props.brId)
        .then(res => {
          if (res.data) {
            const getData = res.data;
            setBrName(getData.brName);
          }
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
      await BranchesService.checkExistAcc(props.brId)
        .then(res => {
          if (res) {
            setAccStatus(res.data.status);
            setBrUsername('cs' + props.brId);
          }
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
    }
    return () => {};
  }, [props.brId, accStatus]);

  const handleSubmit = e => {
    e.preventDefault();
    if (accStatus == 'valid') {
      sendData();
    }
    if (accStatus == 'existed') {
      sendUpdatePassword();
    }
  };
  const sendData = async () => {
    var data = {
      brUsername: brUsername,
      brPassword: brPassword,
      brConfirmPassword: brConfirmPassword,
    };
    console.log(data);
    await BranchesService.createBranchAcc(props.brId, data)
      .then(response => {
        generate('success', response.data.message);
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
  const sendUpdatePassword = async () => {
    var data = {
      brUsername: brUsername,
      brPassword: brPassword,
      brConfirmPassword: brConfirmPassword,
    };
    console.log(data);
    await BranchesService.updateBrAcc(props.brId, data)
      .then(response => {
        generate('success', response.data.message);
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
      <AlertList
        position="top-right"
        alerts={alerts}
        onDismiss={onDismissed}
        timeout={1500}
      />
      <Modal {...props} onShow={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลสำหรับ App User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 mt-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="branchName">
              <Form.Label column sm="3">
                ชื่อสาขา
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  plaintext
                  readOnly
                  value={brName}
                  style={{ fontFamily: 'Prompt' }}
                />
              </Col>
            </Form.Group>
            {accStatus == 'valid' && (
              <div>
                <p style={{ color: 'red' }}>
                  สาขานี้ยังไม่เปิดใช้งานระบบ สร้างรหัสผ่านเพื่อเปิดใช้งาน
                </p>
              </div>
            )}
            <Form.Group as={Row} className="mb-3" controlId="branchUsername">
              <Form.Label column sm="3">
                ชื่อผู้ใช้
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  disabled
                  type="text"
                  placeholder="ชื่อสาขา"
                  value={brUsername}
                />
              </Col>
            </Form.Group>
            {(props.editable || accStatus == 'valid') && (
              <Form.Group as={Row} className="mb-3" controlId="branchPassword">
                <Form.Label column sm="3">
                  รหัสผ่าน
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    type="password"
                    placeholder="รหัสผ่าน"
                    value={brPassword}
                    onChange={e => setBrPassword(e.target.value)}
                  />
                </Col>
              </Form.Group>
            )}
            {(props.editable || accStatus == 'valid') && (
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
                    value={brConfirmPassword}
                    onChange={e => setBrConfirmPassword(e.target.value)}
                  />
                </Col>
              </Form.Group>
            )}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {accStatus == 'valid' && (
                <>
                  <div style={{ flex: 4 }} />
                  <Button
                    variant="tertiary"
                    type="submit"
                    style={{ color: 'white', flex: 2 }}>
                    เปิดใช้งาน
                  </Button>
                </>
              )}
              {accStatus == 'existed' && props.editable && (
                <>
                  <div style={{ flex: 4 }} />
                  <Button
                    variant="tertiary"
                    type="submit"
                    style={{ color: 'white', flex: 2 }}>
                    บันทึกข้อมูล
                  </Button>
                </>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BranchAccDetail;
