import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { InputNumber } from 'antd';
import { useAlert } from 'react-alert';
import ingredientService from 'services/ingredient.service';
import stuffService from 'services/stuff.service';

const IngrStffCreateForm = ({ handleClose, fetchData }) => {
  const alert = useAlert();
  const [name, setName] = useState('');
  const [cost, setCost] = useState('0');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('');
  useEffect(() => {
    document.title = 'เพิ่มข้อมูลวัตถุดิบ';
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (type == '')
      return alert.show('เลือกชนิดสินค้าก่อน!', { type: 'error' });
    sendData();
  };

  const sendData = () => {
    if (type == 'วัตถุดิบ') {
      var ingrData = {
        ingrName: name,
        ingrUnit: unit,
        ingrCost: cost,
      };
      ingredientService
        .createIngredient(ingrData)
        .then(res => {
          alert.show(res.data.message, { type: 'success' });
        })
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          return alert.show(resMessage, { type: 'error' });
        });
    } else if (type == 'อื่นๆ') {
      var stuffData = {
        stuffName: name,
        stuffUnit: unit,
        stuffCost: cost,
      };
      stuffService
        .createStuff(stuffData)
        .then(res => {
          alert.show(res.data.message, { type: 'success' });
        })
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          return alert.show(resMessage, { type: 'error' });
        });
    }
    setName('');
    setCost('0');
    setUnit('');
    setType('');
    fetchData();
    handleClose();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12} className="mb-3">
            <Row>
              <Col md={8} className="mb-3">
                <Form.Group id="ItemNo">
                  <Form.Label>ชื่อวัตถุดิบ</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="ชื่อวัตถุดิบ"
                    name="itemName"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group id="modelID">
                  <Form.Label>ราคาทุน</Form.Label>
                  <InputGroup>
                    <InputNumber
                      min="0"
                      precision="2"
                      stringMode
                      required
                      value={cost}
                      placeholder="0.00"
                      style={{
                        borderRadius: 8,
                        borderColor: '#e8e8e8',
                        height: 43.59,
                        padding: 5,
                        width: 200,
                      }}
                      onChange={value => setCost(value)}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4} className="mb-3">
                <Form.Group id="modelID">
                  <Form.Label>หน่วย</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="อัน,ลิตร,.-,..."
                    name="itemUnit"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group id="modelID">
                  <Form.Label>ชนิดสินค้า </Form.Label>
                  <Form.Select
                    required
                    name="itemType"
                    value={type}
                    onChange={e => setType(e.target.value)}>
                    <option value="">ชนิดสินค้า</option>
                    <option value="วัตถุดิบ">วัตถุดิบ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 9, span: 3 }}>
            <div>
              <Button
                variant="codesom"
                type="submit"
                style={{ width: '100%', height: '50px', color: 'white' }}>
                ยืนยัน
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default IngrStffCreateForm;
