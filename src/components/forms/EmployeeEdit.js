import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
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
import RolesService from 'services/roles.service';
import BranchesService from 'services/branches.service';
import EmployeeService from 'services/employee.service';
import { useAlert } from 'react-alert';

var getRoleData = [];
var getBranchData = [];

const EmployeeEdit = ({ ...props }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [empData, setEmpData] = useState({});
  const [editable, setEditable] = useState(false);
  const alert = useAlert();
  const [empId, setEmpId] = useState('');

  const [roleData, setRoleData] = useState([]);
  const [branchData, setbranchData] = useState([]);

  useEffect(async () => {
    let mounted = true;
    setEmpId(props.empId);
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
    if (empId) {
      fetchEmployeeData(empId);
    }
    return () => (mounted = false);
  }, [empId]);

  const fetchEmployeeData = async empId => {
    await EmployeeService.getEmpById(empId)
      .then(res => {
        const resData = res.data.resData[0];
        setEmpData({
          firstName: resData.first_name,
          lastName: resData.last_name,
          birthDate: moment(resData.birth_date),
          tel: resData.tel,
          address: resData.address,
          roleId: resData.role_id,
          branchId: resData.branch_id,
          salary: resData.salary,
        });
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

  const sendData = values => {
    var data = {
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: moment(values.birthDate).format('YYYY-MM-DD'),
      tel: values.tel,
      address: values.address,
      roleId: values.roleId,
      branchId: values.branchId,
      salary: values.salary,
      recruitDate: moment().format('YYYY-MM-DD'),
    };
    EmployeeService.updateEmp(empId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        fetchEmployeeData(empId);
        setEditable(false);
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
            initialValues={empData}
            onFinish={values => {
              sendData(values);
            }}>
            <h2 className="mb-4">แก้ไขข้อมูลพนักงาน</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="firstName"
                  label="ชื่อ"
                  rules={[
                    { required: true, message: '*ใส่ชื่อ' },
                    { max: 40, message: '*ไม่เกิน 40 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อ" disabled={!editable} />
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
                  <Input placeholder="นามสกุล" disabled={!editable} />
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
                    disabledDate={current => {
                      return moment() < current;
                    }}
                    popupStyle={{ fontFamily: 'Prompt' }}
                    size="large"
                    disabled={!editable}
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
              <Col md={6} xl={6} className="mb-3">
                <Form.Item
                  name="address"
                  label="ที่อยู่"
                  rules={[
                    { max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' },
                    { required: true, message: '*ใส่ที่อยู่' },
                  ]}>
                  <Input.TextArea
                    disabled={!editable}
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
                    disabled={!editable}
                    dropdownStyle={{ fontFamily: 'Prompt' }}>
                    {branchData.map((item, index) => (
                      <Option key={index} value={item.branchId}>
                        {item.branchName}
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
                    disabled={!editable}
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
                    disabled={!editable}
                    precision="2"
                    stringMode
                    placeholder="0.00"
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Row>
                <Col md={{ span: 3 }}>
                  <div>
                    <ButtonA onClick={() => history.back()}>ย้อนกลับ</ButtonA>
                  </div>
                </Col>
                <Col sm={{ span: 3, offset: 3 }}>
                  {editable && (
                    <ButtonA
                      onClick={() => {
                        fetchEmployeeData(empId);
                        setEditable(!editable);
                      }}>
                      ยกเลิก
                    </ButtonA>
                  )}
                </Col>
                <Col sm={3}>
                  {editable && (
                    <ButtonA type="primary" htmlType="submit">
                      ยืนยัน
                    </ButtonA>
                  )}
                  {!editable && (
                    <ButtonA
                      type="primary"
                      htmlType="button"
                      onClick={() => {
                        setEditable(true);
                      }}>
                      แก้ไข
                    </ButtonA>
                  )}
                </Col>
              </Row>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmployeeEdit;
