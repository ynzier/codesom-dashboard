import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';
import FileService from 'services/file.service';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

// services
import BranchService from 'services/branches.service';

const BranchCreate = ({ generate }) => {
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [tel, setTel] = useState('');
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setTel(onlyDigits);
  };

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const sendData = async () => {
    var data = {
      brName: brName,
      brAddr: brAddr,
      brTel: tel, //on start
      brImg: imgId,
    };
    await BranchService.createNewBranch(data)
      .then(response => {
        setTel('');
        setBrName('');
        setBrAddr('');
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
      generate('danger', 'อัพโหลดได้เฉพาะไฟล์ .jpg .png เท่านั้น!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      generate('danger', 'ขนาดรูปจะต้องน้อยกว่า 2MB!');
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
        setBase64TextString(fileInfo.base64);
      };
    }
  };
  useEffect(async () => {
    if (base64TextString) {
      await FileService.upload(base64TextString)
        .then(res => {
          if (res && res.data) {
            setImgId(res.data.imgId);
            console.log(res.data.imgId);
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
  }, [base64TextString]);
  return (
    <>
      <Card
        border="light"
        className="bg-white px-6 py-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
        }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">เพิ่มสาขา</h2>
            <Row className="mb-3">
              <Col sm={{ span: 6, offset: 3 }}>
                <Upload
                  name="branchImg"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={() => {}}
                  beforeUpload={beforeUpload}
                  onChange={handleFileChange}>
                  {base64TextString ? (
                    <img
                      src={base64TextString}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
            </Row>
            <Row>
              <Col>
                <Col md={12} xl={12} className="mb-3">
                  <Form.Group id="brName">
                    <Form.Label>ชื่อสาขา</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="ชื่อสาขา"
                      name="brName"
                      maxLength="40"
                      value={brName}
                      onChange={e => setBrName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Group id="tel">
                      <Form.Label>เบอร์โทรศัพท์</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        maxLength="10"
                        value={tel}
                        placeholder="เบอร์โทรศัพท์"
                        onChange={e => checkInput(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Group id="address">
                      <Form.Label>ที่อยู่</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        as="textarea"
                        rows={5}
                        placeholder="ที่อยู่"
                        name="brAddr"
                        value={brAddr}
                        maxLength="255"
                        onChange={e => setBrAddr(e.target.value)}
                        style={{ resize: 'none', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6} md={6} />
              <Col sm={3} md={3}>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    setBrName('');
                    setTel('');
                    setBrAddr('');
                    setImgId('');
                    setBase64TextString('');
                    setLoading(false);
                  }}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    height: '50px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  ล้างข้อมูล
                </Button>
              </Col>
              <Col sm={3} md={3}>
                <Button
                  variant="tertiary"
                  type="submit"
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    height: '50px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    color: 'white',
                  }}>
                  บันทึกข้อมูล
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
export default BranchCreate;
