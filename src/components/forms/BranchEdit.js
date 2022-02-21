import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button, Image } from 'react-bootstrap';

// services
import BranchesService from 'services/branches.service';

// Modal
import { BranchAccDetail } from 'components';

function BranchEditForm({ ...props }) {
  return (
    <Form>
      <h2 className="mb-4">ข้อมูลสาขา</h2>
      <Row className="my-3">
        <Col sm={6} md={6} />
        <Col sm={3} md={3}>
          <div>
            {!props.editable ? (
              <Button
                variant="tertiary"
                onClick={() => {
                  props.setEditable(!props.editable);
                }}
                style={{
                  borderRadius: '10px',
                  width: '100%',
                  boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  color: 'white',
                }}>
                แก้ไข
              </Button>
            ) : (
              <Button
                variant="tertiary"
                onClick={props.handleSubmit}
                style={{
                  borderRadius: '10px',
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
            {!props.editable ? (
              <Button
                variant="danger"
                onClick={() => {}}
                style={{
                  borderRadius: '10px',
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
                  BranchesService.getBranchById(props.brId)
                    .then(res => {
                      if (res.data) {
                        const getData = res.data;
                        props.setBrName(getData.brName);
                        props.setBrAddr(getData.brAddr);
                        props.setBrTel(getData.brTel);
                        props.setEditable(!props.editable);
                      }
                    })
                    .catch(e => {
                      console.log(e);
                    });
                }}
                style={{
                  borderRadius: '10px',
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
          borderRadius: '10px',
          height: '576px',
          position: 'block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}>
        <Card.Body
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
            }}>
            <div
              style={{
                flex: 6,
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  flex: 1,
                  objectFit: 'contain',
                  width: '100%',
                  minHeight: '184px',
                  height: '90%',
                  backgroundColor: 'grey',
                }}
              />
            </div>
            <div
              style={{
                flex: 2,
              }}
            />
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
                      disabled={!props.editable}
                      type="text"
                      placeholder="ชื่อสาขา"
                      value={props.brName}
                      onChange={e => props.setBrName(e.target.value)}
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
                      disabled={!props.editable}
                      type="text"
                      as="textarea"
                      rows={3}
                      placeholder="ที่อยู่"
                      value={props.brAddr}
                      onChange={e => props.setBrAddr(e.target.value)}
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
                      disabled={!props.editable}
                      type="phone"
                      maxLength="10"
                      placeholder="เบอร์โทร"
                      value={props.brTel}
                      onChange={e => {
                        props.checkInput(e);
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
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <div
                style={{
                  flex: 18,
                }}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword">
                  <Form.Label column sm="3">
                    ผู้จัดการสาขา
                  </Form.Label>
                  <Col sm="6">
                    <Form.Control
                      disabled={!props.editable}
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
                      disabled={!props.editable}
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
                      disabled={!props.editable}
                      type="text"
                      placeholder="การเข้างาน"
                    />
                  </Col>
                </Form.Group>
              </div>
              <div
                style={{
                  flex: 1,
                }}></div>
            </div>
            <div
              style={{
                alignSelf: 'flex-end',
                color: '#C6C6C6',
                textDecoration: 'underline',
              }}>
              <div onClick={() => props.setModalShow(true)}>
                ข้อมูลสำหรับเข้าสู่ระบบ
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Form>
  );
}

const BranchEdit = ({ generate, ...props }) => {
  const [editable, setEditable] = useState(false);
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [brTel, setBrTel] = useState('');
  const [modalShow, setModalShow] = useState(false);

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    await BranchesService.getBranchById(props.brId)
      .then(res => {
        if (res.data) {
          const getData = res.data;
          setBrName(getData.brName);
          setBrAddr(getData.brAddr);
          setBrTel(getData.brTel);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [props.brId]);

  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setBrTel(onlyDigits);
  };

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
    await BranchesService.updateBranch(props.brId, data)
      .then(response => {
        generate('success', response.data.message);
        setEditable(!editable);
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
      <Card
        border="light"
        className="bg-white px-6 py-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Body>
          <BranchEditForm
            brId={props.brId}
            editable={editable}
            setEditable={setEditable}
            brName={brName}
            setBrName={setBrName}
            brAddr={brAddr}
            setBrAddr={setBrAddr}
            brTel={brTel}
            setBrTel={setBrTel}
            checkInput={checkInput}
            handleSubmit={handleSubmit}
            setModalShow={setModalShow}
          />
          <Row className="mt-3">
            <Col sm={3} md={3}>
              <div>
                <Button
                  variant="codesom"
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    color: 'white',
                  }}
                  onClick={() => {
                    history.back();
                  }}>
                  ย้อนกลับ
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <BranchAccDetail
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        brId={props.brId}
        editable={editable}
      />
    </>
  );
};
export default BranchEdit;
