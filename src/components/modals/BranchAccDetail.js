import React, { useState, useEffect } from 'react';
import { AlertList } from 'react-bs-notifier';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import BranchesService from 'services/branches.service';

var getBrId;
const BranchAccDetail = props => {
  const [brId, setBrId] = useState();
  const [authData, setAuthData] = useState();
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [brTel, setBrTel] = useState('');
  const [brUsername, setBrUsername] = useState('');
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
    let mounted = true;
    if (props.brId && mounted) {
      console.log(props.brId);
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
            if (accStatus == 'existed') setBrUsername(res.data.data.brUsername);
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
        <Modal.Body>
          <p>ชื่อสาขา: {brName}</p>
          {accStatus == 'valid' && (
            <p style={{ color: 'red' }}>สาขานี้ยังไม่เปิดใช้งานระบบ</p>
          )}
          {accStatus == 'existed' && <p>ID:{brUsername}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="codesom">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BranchAccDetail;
