import React, { useState, useEffect } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import FileService from 'services/file.service';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, InputNumber, Input, Upload, Button as ButtonA } from 'antd';
import { useAlert } from 'react-alert';

// services
import BranchService from 'services/branches.service';

const BranchCreate = () => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();

  const handleSubmit = async value => {
    var data = {
      brName: value.brName,
      brAddr: value.address,
      brTel: '0' + value.tel, //on start
      brImg: imgId,
    };
    await BranchService.createNewBranch(data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        form.resetFields();
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
          alert.show(resMessage, { type: 'error' });
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
          fontFamily: 'Prompt',
        }}>
        <Card.Body>
          <Form
            form={form}
            name="createBranch"
            preserve={false}
            layout="vertical"
            onFinish={values => {
              handleSubmit(values);
            }}>
            <h2 className="mb-4">เพิ่มสาขา</h2>
            <Row className="mb-3">
              <Col sm={{ span: 6, offset: 3 }}>
                <Upload
                  name="productImg"
                  listType="picture-card"
                  className="avatar-uploader mb-1"
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
                  <Form.Item
                    name="brName"
                    label="ชื่อสาขา"
                    rules={[
                      { required: true, message: '*ใส่ชื่อสาขา' },
                      { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                    ]}>
                    <Input placeholder="ชื่อสาขา" />
                  </Form.Item>
                </Col>

                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Item
                      name="tel"
                      label="เบอร์โทรศัพท์"
                      rules={[
                        { required: true, message: '*ใส่เบอร์โทรศัพท์' },
                        { max: 9, message: '*ตัวเลขต้องไม่เกิน 9 ตัว' },
                        { min: 8, message: '*ใส่เบอร์โทรศัพท์ให้ครบ' },
                      ]}>
                      <InputNumber
                        stringMode
                        addonBefore="+66"
                        placeholder="เบอร์โทรศัพท์"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Item
                      name="address"
                      label="ที่อยู่"
                      rules={[
                        { max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' },
                        { required: true, message: '*ใส่ที่อยู่' },
                      ]}>
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="ที่อยู่"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={3} md={{ span: 3, offset: 9 }}>
                <ButtonA
                  style={{
                    width: '100%',
                    height: '50px',
                    borderRadius: '10px',
                    borderWidth: '0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    backgroundColor: '#2DC678',
                  }}
                  htmlType="submit">
                  บันทึกข้อมูล
                </ButtonA>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
export default BranchCreate;
