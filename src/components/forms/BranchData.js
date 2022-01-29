import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button, Image } from 'react-bootstrap';

import { AlertList } from 'react-bs-notifier';

// services
import BranchesService from 'services/branches.service';

// CSS
import './index.css';

const BranchCreate = props => {
  const [editable, setEditable] = useState(false);
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [brTel, setBrTel] = useState('');

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    await BranchesService.getBranchById(props.brId)
      .then(res => {
        if (mounted) {
          if (res.data) {
            const getData = res.data;
            setBrName(getData.brName);
            setBrAddr(getData.brAddr);
            setBrTel(getData.brTel);
            console.log(brName);
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
    return () => (mounted = false);
  }, [props.brId]);

  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setBrTel(onlyDigits);
  };

  const [alerts, setAlerts] = React.useState([]);
  const generate = React.useCallback((type, message) => {
    const headline =
      type === 'danger'
        ? 'ข้อผิดพลาด'
        : type === 'success'
        ? 'สำเร็จ'
        : type === 'warning'
        ? 'คำเตือน'
        : null;
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

  const form = document.forms[0];

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const sendData = async () => {
    var data = {
      brName: brName,
      brAddr: brAddr,
      brTel: brTel, //on start
    };
    await BranchesService.createNewBranch(data)
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
      <AlertList
        position="top-right"
        alerts={alerts}
        onDismiss={onDismissed}
        timeout={1500}
      />
      <Card
        border="light"
        className="bg-white px-6 py-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">ข้อมูลสาขา</h2>
            <Row className="my-3">
              <Col sm={6} md={6} />
              <Col sm={3} md={3}>
                <div>
                  {!editable ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditable(!editable);
                      }}
                      style={{
                        borderRadius: '36px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        color: 'white',
                      }}>
                      แก้ไข
                    </Button>
                  ) : (
                    <Button
                      variant="tertiary"
                      // type="submit"
                      style={{
                        borderRadius: '36px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        color: 'white',
                      }}>
                      บันทึกข้อมูล
                    </Button>
                  )}
                </div>
              </Col>
              <Col sm={3} md={3}>
                <div>
                  {!editable ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setBrName('');
                        setBrTel('');
                        setBrAddr('');
                      }}
                      style={{
                        borderRadius: '36px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        color: 'white',
                      }}>
                      ลบ
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => {
                        location.reload();
                      }}
                      style={{
                        borderRadius: '36px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        color: 'white',
                      }}>
                      ยกเลิก
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
            <Card
              border="light"
              className="bg-white px-4 py-4"
              style={{
                borderRadius: '36px',
                height: '576px',
                position: 'block',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <div style={{ flex: 6 }}>
                    <Image
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        minHeight: '184px',
                        backgroundColor: 'grey',
                      }}
                    />
                  </div>
                  <div style={{ flex: 2 }} />
                  <div
                    style={{
                      display: 'flex',
                      flex: 10,
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      marginTop: '10px',
                    }}>
                    <div>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                          ชื่อสาขา
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            disabled={!editable}
                            type="text"
                            placeholder="ชื่อสาขา"
                            value={brName}
                            onChange={e => setBrName(e.target.value)}
                          />
                        </Col>
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                          ที่อยู่
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            disabled={!editable}
                            type="text"
                            placeholder="ที่อยู่"
                            value={brAddr}
                            onChange={e => setBrAddr(e.target.value)}
                          />
                        </Col>
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="2">
                          เบอร์โทร
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            disabled={!editable}
                            type="phone"
                            maxLength="10"
                            placeholder="เบอร์โทร"
                            value={brTel}
                            onChange={e => {
                              checkInput(e);
                            }}
                          />
                        </Col>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 2,
                    marginTop: '24px',
                  }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 18 }}>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                          ผู้จัดการสาขา
                        </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            disabled={!editable}
                            type="text"
                            placeholder="ผู้จัดการ"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                          จำนวนพนักงาน
                        </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            type="number"
                            disabled={!editable}
                            placeholder="จำนวนพนักงาน"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                          การเข้างานของพนักงาน
                        </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            disabled={!editable}
                            type="text"
                            placeholder="การเข้างาน"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        className="mb-3"
                        controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                          เวลาทำการ
                        </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            disabled={!editable}
                            type="text"
                            placeholder="เวลาทำการ"
                          />
                        </Col>
                      </Form.Group>
                    </div>
                    <div style={{ flex: 1 }}></div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Form>
          <Row className="mt-3">
            <Col sm={3} md={3}>
              <div>
                <Button
                  variant="secondary"
                  style={{
                    borderRadius: '36px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    color: 'white',
                  }}>
                  ย้อนกลับ
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};
export default BranchCreate;
