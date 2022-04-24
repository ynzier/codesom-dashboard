import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Col, Row, Form, Button, Modal } from 'react-bootstrap';
import BranchesService from 'services/branches.service';

const BranchAccDetail = ({ ...props }) => {
  const alert = useAlert();

  const [branchName, setBrName] = useState('');
  const [branchUsername, setbranchUsername] = useState('');
  const [branchPassword, setBranchPassword] = useState('');
  const [branchConfirmPassword, setBrConfirmPassword] = useState('');
  const [accStatus, setAccStatus] = useState('');

  const refresh = async () => {
    await BranchesService.getBranchById(props.branchId)
      .then(res => {
        if (res.data) {
          const getData = res.data;
          setBrName(getData.branchName);
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
    await BranchesService.checkExistAcc(props.branchId)
      .then(res => {
        if (res) {
          setAccStatus(res.data.status);
          setbranchUsername('cs' + props.branchId);
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
  useEffect(async () => {
    if (props.branchId) {
      await BranchesService.getBranchById(props.branchId)
        .then(res => {
          if (res.data) {
            const getData = res.data;
            setBrName(getData.branchName);
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
      await BranchesService.checkExistAcc(props.branchId)
        .then(res => {
          if (res) {
            setAccStatus(res.data.status);
            setbranchUsername('cs' + props.branchId);
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
    }
    return () => {};
  }, [props.branchId, accStatus]);

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
      branchUsername: branchUsername,
      branchPassword: branchPassword,
      branchConfirmPassword: branchConfirmPassword,
    };
    await BranchesService.createBranchAcc(props.branchId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        refresh();
        props.setModalShow(false);
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
  const sendUpdatePassword = async () => {
    var data = {
      branchUsername: branchUsername,
      branchPassword: branchPassword,
      branchConfirmPassword: branchConfirmPassword,
    };
    await BranchesService.updateBrAcc(props.branchId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        refresh();
        props.setModalShow(false);
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
                  value={branchName}
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
                  value={branchUsername}
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
                    value={branchPassword}
                    onChange={e => setBranchPassword(e.target.value)}
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
                    value={branchConfirmPassword}
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
