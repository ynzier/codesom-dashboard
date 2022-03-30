import React, { useState, useEffect } from 'react';
import FileService from 'services/file.service';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Row, Card, Button } from 'react-bootstrap';
import moment from 'moment-timezone';
import 'moment/locale/th';
import {
  Form,
  InputNumber,
  Input,
  Upload,
  Button as ButtonA,
  TimePicker,
  Select,
} from 'antd';
import { useAlert } from 'react-alert';

// services
import BranchService from 'services/branches.service';
import employeeService from 'services/employee.service';

// Modal
import { BranchAccDetail } from 'components';
const { RangePicker } = TimePicker;

const BranchEdit = ({ ...props }) => {
  const [editable, setEditable] = useState(false);
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [managerList, setManagerList] = useState([]);
  const [branchData, setBranchData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
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
  const fetchBranchData = async brId => {
    await BranchService.getBranchById(brId)
      .then(res => {
        if (res.data) {
          const getData = res.data;
          console.log(getData);
          setBranchData(getData);
          setBase64TextString(res.data?.image?.imgObj);
          form.resetFields();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    fetchBranchData(props.brId);
  }, [props.brId]);
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

  const sendData = async value => {
    var data = {
      brName: value.brName,
      brAddr: value.brAddr,
      brTel: value.brTel, //on start
      brImg: imgId,
      brManager: value.brManager,
      brOpenTime: moment(value.openClose[0]).format('HH:mm'),
      brCloseTime: moment(value.openClose[1]).format('HH:mm'),
    };
    await BranchService.updateBranch(props.brId, data)
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
          <Form
            form={form}
            name="createBranch"
            preserve={false}
            layout="vertical"
            initialValues={branchData}
            onFinish={values => {
              sendData(values);
            }}>
            <h2 className="mb-4">ข้อมูลสาขา</h2>
            <Row>
              <Col sm={{ span: 6 }}>
                <Upload
                  name="productImg"
                  listType="picture-card"
                  className="avatar-uploader mb-1"
                  disabled={!editable}
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
                  name="brName"
                  label="ชื่อสาขา"
                  rules={[
                    { required: true, message: '*ใส่ชื่อสาขา' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อสาขา" disabled={!editable} />
                </Form.Item>
                <Form.Item
                  name="brTel"
                  label="เบอร์โทรศัพท์"
                  rules={[
                    { required: true, message: '*ใส่เบอร์โทรศัพท์' },
                    { max: 10, message: '*ตัวเลขต้องไม่เกิน 10 ตัว' },
                    { min: 9, message: '*ใส่เบอร์โทรศัพท์ให้ครบ' },
                  ]}>
                  <Input
                    disabled={!editable}
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
                      initialValue={[
                        moment(branchData.brOpenTime, 'HH:mm'),
                        moment(branchData.brCloseTime, 'HH:mm'),
                      ]}
                      rules={[
                        {
                          required: true,
                          message: '*เลือกช่วงเวลาเปิด-ปิดสาขา',
                        },
                      ]}>
                      <RangePicker
                        format={'HH:mm'}
                        placeholder={['เวลาเปิด', 'เวลาปิด']}
                        disabled={!editable}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col className="mb-3">
                    <Form.Item
                      name="brManager"
                      label="ผู้จัดการสาขา"
                      rules={[
                        {
                          required: true,
                          message: '*เลือกช่วงเวลาเปิด-ปิดสาขา',
                        },
                      ]}>
                      <Select
                        placeholder="เลือกผู้จัดการ"
                        showSearch
                        disabled={!editable}
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
                      name="brAddr"
                      label="ที่อยู่"
                      rules={[
                        { max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' },
                        { required: true, message: '*ใส่ที่อยู่' },
                      ]}>
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="ที่อยู่"
                        disabled={!editable}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <div
                  className="mb-3"
                  style={{
                    color: '#C6C6C6',
                    textDecoration: 'underline',
                    float: 'right',
                  }}>
                  <div onClick={() => setModalShow(true)}>
                    ข้อมูลสำหรับเข้าสู่ระบบ
                  </div>
                </div>
              </Col>
            </Row>
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
                {!editable ? (
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
                      fetchBranchData(props.brId);
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
                {!editable ? (
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setEditable(!editable);
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
                  <ButtonA
                    style={{
                      width: '100%',
                      height: '43.59px',
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
                )}
              </Col>
            </Row>
          </Form>
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
