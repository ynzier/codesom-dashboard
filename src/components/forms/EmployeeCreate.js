import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import RolesService from 'services/roles.service';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import {
  Form,
  InputNumber,
  Select,
  Input,
  Button as ButtonA,
  DatePicker,
} from 'antd';
import BranchesService from 'services/branches.service';
import EmployeeService from 'services/employee.service';
import { useAlert } from 'react-alert';

var getRoleData = [];
var getBranchData = [];

const CreateEmployeeForm = () => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const alert = useAlert();
  const [roleData, setRoleData] = useState([]);
  const [branchData, setbranchData] = useState([]);

  useEffect(() => {
    let mounted = true;
    RolesService.getAllRoles()
      .then(res => {
        if (mounted) {
          getRoleData = res.data;
          setRoleData(getRoleData);
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
    BranchesService.getAllBranch()
      .then(res => {
        if (mounted) {
          getBranchData = res.data;
          setbranchData(getBranchData);
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
    return () => (mounted = false);
  }, []);

  const sendData = values => {
    var data = {
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: moment(values.birthDate).format('YYYY-MM-DD'),
      tel: '0' + values.tel,
      address: values.address,
      roleId: values.roleId,
      branchId: values.branchId,
      salary: values.salary,
      recruitDate: moment().format('YYYY-MM-DD'),
    };
    EmployeeService.createNewEmployee(data)
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
            name="createEmployee"
            preserve={false}
            layout="vertical"
            onFinish={values => {
              sendData(values);
            }}>
            <h2 className="mb-4">เพิ่มพนักงานใหม่</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="firstName"
                  label="ชื่อ"
                  rules={[
                    { required: true, message: '*ใส่ชื่อ' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อ" />
                </Form.Item>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="lastName"
                  label="นามสกุล"
                  rules={[
                    { required: true, message: '*ใส่นามสกุล' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="นามสกุล" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="birthDate"
                  label="วัน/เดือน/ปีเกิด"
                  rules={[{ required: true, message: '*ใส่วัน/เดือน/ปีเกิด' }]}>
                  <DatePicker
                    locale={locale}
                    popupStyle={{ fontFamily: 'Prompt' }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
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
            <Row>
              <Col md={6} xl={6} className="mb-3">
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
            <Row>
              <Col md={6} xl={6} className="mb-2">
                <Form.Item
                  name={'branchId'}
                  label="สาขา"
                  rules={[{ required: true, message: '*เลือกสาขา' }]}>
                  <Select
                    placeholder="กดเพื่อเลือกสาขา"
                    value={'branchId'}
                    dropdownStyle={{ fontFamily: 'Prompt' }}>
                    {branchData.map((item, index) => (
                      <Option key={index} value={item.brId}>
                        {item.brName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name={'roleId'}
                  label="ตำแหน่ง"
                  rules={[{ required: true, message: '*เลือกตำแหน่ง' }]}>
                  <Select
                    placeholder="กดเพื่อเลือกตำแหน่ง"
                    value={'branchId'}
                    dropdownStyle={{ fontFamily: 'Prompt' }}>
                    {roleData.map((item, index) => (
                      <Option key={index} value={item.roleId}>
                        {item.roleName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="salary"
                  label="เงินเดือน"
                  rules={[{ required: true, message: '*กรอกเงินเดือน' }]}>
                  <InputNumber
                    min="0"
                    precision="2"
                    stringMode
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={6} />
              <Col sm={3}>
                <Button
                  variant="outline-danger"
                  onClick={() => {
                    form.resetFields();
                  }}
                  style={{
                    borderRadius: '10px',
                    width: '100%',
                    borderWidth: 0,
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  ล้างข้อมูล
                </Button>
              </Col>
              <Col sm={3}>
                <ButtonA
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    borderWidth: '0',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    backgroundColor: '#2DC678',
                  }}
                  htmlType="submit">
                  ยืนยัน
                </ButtonA>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default CreateEmployeeForm;
