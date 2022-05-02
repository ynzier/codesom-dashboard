import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { InputNumber, Button, Input, Select, Form } from 'antd';
import { useAlert } from 'react-alert';
import ingredientService from 'services/ingredient.service';
import stuffService from 'services/stuff.service';

const { Option } = Select;
const IngrStffCreateForm = ({ handleClose, fetchData }) => {
  const alert = useAlert();
  const [form] = Form.useForm();
  useEffect(() => {
    document.title = 'เพิ่มข้อมูลวัตถุดิบ';
  }, []);

  const handleSubmit = e => {
    console.log(e);
    if (e.type == 'วัตถุดิบ') {
      var ingrData = {
        ingrName: e.name,
        ingrUnit: e.unit,
        ingrCost: e.cost,
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
    } else if (e.type == 'อื่นๆ') {
      var stuffData = {
        stuffName: e.name,
        stuffUnit: e.unit,
        stuffCost: e.cost,
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
    fetchData();
    handleClose();
  };

  return (
    <>
      <Form
        form={form}
        name="createIngrStff"
        preserve={false}
        layout="vertical"
        onFinish={handleSubmit}>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={8}>
                <Form.Item
                  name="name"
                  label="ชื่อวัตถุดิบ"
                  rules={[
                    { required: true, message: '*ใส่ชื่อวัตถุดิบ' },
                    { max: 20, message: '*ไม่เกิน 20 ตัวอักษร' },
                  ]}>
                  <Input placeholder="ชื่อวัตถุดิบ" />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item
                  name="cost"
                  label="ราคาทุน"
                  rules={[{ required: true, message: '*ใส่ราคา' }]}>
                  <InputNumber
                    min="0"
                    precision="2"
                    style={{ width: '100%' }}
                    stringMode
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Item
                  name="unit"
                  label="หน่วย"
                  rules={[
                    { required: true, message: '*ใส่หน่วย' },
                    { max: 10, message: '*ไม่เกิน 10 ตัวอักษร' },
                  ]}>
                  <Input placeholder="อัน,ลิตร,.-,..." />
                </Form.Item>
              </Col>
              <Col md={4}>
                <Form.Item
                  name={'type'}
                  label="ชนิดสินค้า"
                  rules={[{ required: true, message: '*เลือกประเภท' }]}>
                  <Select
                    placeholder="เลือกประเภท"
                    value={'type'}
                    dropdownStyle={{ fontFamily: 'Prompt' }}>
                    <Option value="วัตถุดิบ">วัตถุดิบ</Option>
                    <Option value="อื่นๆ">อื่นๆ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 9, span: 3 }}>
            <div>
              <Button type="primary" htmlType="submit">
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
