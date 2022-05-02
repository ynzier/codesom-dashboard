import React, { useState, useEffect } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import FileService from 'services/file.service';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Upload,
  Button as ButtonA,
  TimePicker,
  Select,
} from 'antd';
import { useAlert } from 'react-alert';
import moment from 'moment-timezone';
import 'moment/locale/th';

const { RangePicker } = TimePicker;
// services
import BranchService from 'services/branches.service';
import employeeService from 'services/employee.service';

const BranchCreate = () => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const [managerList, setManagerList] = useState([]);

  const fetchAdminManager = () => {
    employeeService
      .getAdminManagerList()
      .then(res => setManagerList(res.data))
      .catch(err => console.log(err));
  };
  useEffect(() => {
    fetchAdminManager();

    return () => {};
  }, []);

  const handleSubmit = async value => {
    var data = {
      branchName: value.branchName,
      branchAddr: value.address,
      branchTel: value.tel, //on start
      branchImg: imgId,
      branchManager: value.branchManager,
      branchOpen: moment(value.openClose[0]).format('HH:mm'),
      branchClose: moment(value.openClose[1]).format('HH:mm'),
    };
    await BranchService.createNewBranch(data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        form.resetFields();
        history.back();
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
            <Row>
              <Col sm={{ span: 6 }}>
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
              <Col>
                <Form.Item
                  name="branchName"
                  label="ชื่อสาขา"
                  rules={[
                    { required: true, message: '*ใส่ชื่อสาขา' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อสาขา" />
                </Form.Item>
                <Form.Item
                  name="tel"
                  label="เบอร์โทรศัพท์"
                  rules={[
                    { required: true, message: '*ใส่เบอร์โทรศัพท์' },
                    { max: 10, message: '*ตัวเลขต้องไม่เกิน 10 ตัว' },
                    { min: 9, message: '*ใส่เบอร์โทรศัพท์ให้ครบ' },
                  ]}>
                  <Input
                    placeholder="เบอร์โทรศัพท์"
                    type="number"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <Form.Item
                      name="openClose"
                      label="เวลาทำการ"
                      rules={[
                        {
                          required: true,
                          message: '*เลือกช่วงเวลาเปิด-ปิดสาขา',
                        },
                      ]}>
                      <RangePicker
                        format={'HH:mm'}
                        placeholder={['เวลาเปิด', 'เวลาปิด']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-3">
                    <Form.Item name="branchManager" label="ผู้จัดการสาขา">
                      <Select
                        placeholder="เลือกผู้จัดการ"
                        showSearch
                        dropdownStyle={{ fontFamily: 'Prompt' }}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }>
                        {managerList.map((item, index) => (
                          <Option key={index} value={item.empId}>
                            {item.information}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col className="mb-3">
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
                <ButtonA type="primary" htmlType="submit">
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
