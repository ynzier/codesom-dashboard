import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button, InputGroup } from 'react-bootstrap';
import moment from 'moment-timezone';
import Datetime from 'react-datetime';
import { AlertList } from 'react-bs-notifier';
import RolesService from 'services/roles.service';
import { FaCalendarAlt } from 'react-icons/fa';
import BranchesService from 'services/branches.service';
import EmployeeService from 'services/employee.service';
import './index.css';

var getRoleData = [];
var getBranchData = [];

const EmployeeEdit = props => {
  const [editable, setEditable] = useState(false);
  const [empId, setEmpId] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState();
  const [roleData, setRoleData] = useState([]);
  const [branchData, setbranchData] = useState([]);
  const [salary, setSalary] = useState(0);
  const blockInvalidChar = e =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
  const [selectedRoleId, setRoleId] = useState('');
  const [selectedBranchId, setBranchId] = useState('');
  const [address, setAddress] = useState('');
  const [tel, setTel] = useState('');
  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setTel(onlyDigits);
  };

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
    setEmpId(props.empId);
    await RolesService.getAllRoles()
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
        generate('danger', resMessage);
      });
    await BranchesService.getAllBranch()
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
        generate('danger', resMessage);
      });
    if (empId) {
      await EmployeeService.getEmpById(empId)
        .then(res => {
          const resData = res.data.resData[0];
          if (mounted) {
            console.log(resData);
            setFirstName(resData.first_name);
            setLastName(resData.last_name);
            setBirthDate(moment(resData.birth_date).format('DD/MM/YYYY'));
            setTel(resData.tel);
            setAddress(resData.address);
            setRoleId(resData.role_id);
            setBranchId(resData.branch_id);
            setSalary(resData.salary);
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
    return () => (mounted = false);
  }, [empId]);

  const form = document.forms[0];

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const sendData = () => {
    var data = {
      firstName: firstName,
      lastName: lastName,
      birthDate: moment(birthDate).format('YYYY-MM-DD'),
      tel: tel,
      address: address,
      roleId: selectedRoleId.toString(),
      branchId: selectedBranchId.toString(),
      salary: salary,
    };
    console.log(data);
    EmployeeService.updateEmp(empId, data)
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
        }}>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-4">ข้อมูลพนักงาน</h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="firstname">
                  <Form.Label>ชื่อ</Form.Label>
                  <Form.Control
                    required
                    disabled={!editable}
                    type="text"
                    placeholder="ชื่อ"
                    name="firstName"
                    value={firstName}
                    autoComplete="new-password"
                    maxLength="40"
                    onChange={e => setFirstName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="lastname">
                  <Form.Label>นามสกุล</Form.Label>
                  <Form.Control
                    required
                    disabled={!editable}
                    type="text"
                    placeholder="นามสกุล"
                    name="lastName"
                    value={lastName}
                    maxLength="40"
                    autoComplete="new-password"
                    onChange={e => setLastName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="birthDate">
                  <Form.Label>วัน/เดือน/ปีเกิด</Form.Label>
                  <Datetime
                    timeFormat={false}
                    onChange={setBirthDate}
                    closeOnSelect={true}
                    renderInput={(props, openCalendar) => (
                      <InputGroup>
                        <InputGroup.Text>
                          <FaCalendarAlt />
                        </InputGroup.Text>
                        <Form.Control
                          disabled={!editable}
                          required
                          type="text"
                          autoComplete="new-password"
                          value={
                            birthDate
                              ? moment(birthDate, 'DD/MM/YYYY').format(
                                  'DD/MM/YYYY',
                                )
                              : ''
                          }
                          style={{paddingLeft: '10px'}}
                          name="birthDate"
                          placeholder="วัน/เดือน/ปีเกิด"
                          onFocus={openCalendar}
                          onChange={e => {
                            setBirthDate(
                              moment(e.target.value).format('DD/MM/YYYY'),
                            );
                          }}
                        />
                      </InputGroup>
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="tel">
                  <Form.Label>เบอร์โทรศัพท์</Form.Label>
                  <Form.Control
                    required
                    disabled={!editable}
                    type="tel"
                    maxLength="10"
                    value={tel}
                    autoComplete="new-password"
                    placeholder="เบอร์โทรศัพท์"
                    onChange={e => checkInput(e)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="address">
                  <Form.Label>ที่อยู่</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    as="textarea"
                    rows={3}
                    placeholder="ที่อยู่"
                    name="address"
                    maxLength="255"
                    disabled={!editable}
                    value={address}
                    autoComplete="new-password"
                    onChange={e => setAddress(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-2">
                <Form.Group id="branch">
                  <Form.Label>สาขา</Form.Label>
                  <Form.Select
                    required
                    disabled={!editable}
                    value={selectedBranchId}
                    onChange={e => setBranchId(e.target.value)}>
                    <option value="">เลือกสาขา</option>
                    {branchData.map(option => (
                      <option key={option.brId} value={option.brId}>
                        {option.brName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="role">
                  <Form.Label>ตำแหน่ง</Form.Label>
                  <Form.Select
                    required
                    disabled={!editable}
                    value={selectedRoleId}
                    onChange={e => setRoleId(e.target.value)}>
                    <option value="">เลือกตำแหน่ง</option>
                    {roleData.map(option => (
                      <option key={option.roleId} value={option.roleId}>
                        {option.roleName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Form.Group id="salary">
                  <Form.Label>เงินเดือน</Form.Label>
                  <Form.Control
                    required
                    disabled={!editable}
                    type="number"
                    placeholder="เงินเดือน (บาท)"
                    name="salary"
                    value={salary}
                    autoComplete="new-password"
                    min="0"
                    onWheel={event => event.currentTarget.blur()}
                    onKeyDown={blockInvalidChar}
                    onChange={e => setSalary(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={9} md={9} />
              <Col sm={3} md={3}>
                <div>
                  {!editable ? (
                    <Button
                      variant="secondary"
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
                    <Button
                      variant="tertiary"
                      onClick={handleSubmit}
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
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default EmployeeEdit;
