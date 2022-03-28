import React, { useState, useEffect } from 'react';
import FileService from 'services/file.service';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';
import { Upload } from 'antd';
import { useAlert } from 'react-alert';

// services
import BranchesService from 'services/branches.service';

// Modal
import { BranchAccDetail } from 'components';

function BranchEditForm({ ...props }) {
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      alert.show('อัพโหลดได้เฉพาะไฟล์ .jpg .png เท่านั้น!', { type: 'error' });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      alert.show('ขนาดรูปจะต้องน้อยกว่า 2MB!', { type: 'error' });
    }
    return isJpgOrPng && isLt2M;
  };
  const handleFileChange = e => {
    setLoading(true);
    let file = e.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file,
        };
        props.setBase64TextString(fileInfo.base64);
      };
    }
  };
  return (
    <Form>
      <h2 className="mb-4">ข้อมูลสาขา</h2>
      <Row className="my-3">
        <Col sm={6} md={6} />
        <Col sm={3} md={3}></Col>
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
                alignItems: 'center',
              }}>
              <Upload
                disabled={!props.editable}
                name="brImg"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={() => {}}
                beforeUpload={beforeUpload}
                onChange={handleFileChange}>
                {props.base64TextString ? (
                  <img
                    src={props.base64TextString}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
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
                      disabled={true}
                      type="text"
                      placeholder="ผู้จัดการ"
                      value={props.manager}
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
          <Row className="mt-3">
            <Col sm={3} md={3}>
              <div>
                <Button
                  variant="outline-codesom"
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}
                  onClick={() => {
                    history.back();
                  }}>
                  ย้อนกลับ
                </Button>
              </div>
            </Col>
            <Col sm={{ span: 3, offset: 3 }} md={{ span: 3, offset: 3 }}>
              {!props.editable ? (
                <Button
                  variant="outline-danger"
                  onClick={() => {}}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  ลบ
                </Button>
              ) : (
                <Button
                  variant="outline-danger"
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
                      .catch(error => {
                        const resMessage =
                          (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                          error.message ||
                          error.toString();

                        alert.show(resMessage, { type: 'error' });
                      });
                  }}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  ยกเลิก
                </Button>
              )}
            </Col>
            <Col sm={3} md={3}>
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
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Form>
  );
}

const BranchEdit = ({ ...props }) => {
  const [editable, setEditable] = useState(false);
  const alert = useAlert();
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [brTel, setBrTel] = useState('');
  const [manager, setManager] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    await BranchesService.getBranchById(props.brId)
      .then(res => {
        if (res.data) {
          const getData = res.data;
          setBrName(getData.brName);
          setBrAddr(getData.brAddr);
          setBrTel(getData.brTel);
          setManager(
            getData.employee.firstName + ' ' + getData.employee.lastName,
          );
          setBase64TextString(getData.image.imgObj);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [props.brId]);
  useEffect(async () => {
    if (base64TextString && editable) {
      await FileService.upload(base64TextString)
        .then(res => {
          if (res && res.data) {
            setImgId(res.data.imgId);
          }
        })
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            alert.show(resMessage, { type: 'error' });
        });
    }
  }, [base64TextString]);
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
      brImg: imgId,
    };
    await BranchesService.updateBranch(props.brId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        setEditable(!editable);
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
            setBase64TextString={setBase64TextString}
            base64TextString={base64TextString}
            manager={manager}
          />
        </Card.Body>
      </Card>
      <BranchAccDetail
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        brId={props.brId}
        editable={editable}
        setModalShow={setModalShow}
      />
    </>
  );
};
export default BranchEdit;
