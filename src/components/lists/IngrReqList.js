import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form as FormBS, Button } from 'react-bootstrap';
import {
  Form,
  Col as ColA,
  Row as RowA,
  InputNumber,
  Select,
  Button as ButtonA,
  Table,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAlert } from 'react-alert';
import { IoIosTrash } from 'react-icons/io';

// services
import BranchesService from 'services/branches.service';

var getBranchData = [];
const { Option } = Select;

const AddReqList = ({ ...props }) => {
  const alert = useAlert();

  const onFinish = values => {
    if (props.selectedBranchId) {
      props.setReqData(values.product);
    } else {
      alert.show('เลือกสาขาก่อนทำการยืนยัน', { type: 'error' });
    }
  };

  return (
    <Form form={props.form} name="reqIngrForm" onFinish={onFinish}>
      <Form.List name="product">
        {(fields, { add, remove }, { error }) => {
          console.log(error);
          return (
            <>
              {fields.map((field, index) => (
                <RowA key={field.key} style={{ height: '100%' }}>
                  <ColA span={12}>
                    <Form.Item
                      name={[index, 'reqPrName']}
                      rules={[{ required: true, message: '*เลือกรายการ' }]}>
                      <Select
                        placeholder="กดเพื่อเลือกรายการ"
                        dropdownStyle={{ fontFamily: 'Prompt' }}>
                        <Option value="มังคุด">มังคุด</Option>
                      </Select>
                    </Form.Item>
                  </ColA>
                  <ColA span={8} />
                  <ColA span={3} style={{ textAlign: 'center' }}>
                    <Form.Item
                      name={[index, 'reqCount']}
                      rules={[{ required: true, message: 'ใส่จำนวน' }]}>
                      <InputNumber
                        min="1"
                        max="1000"
                        style={{
                          textAlign: 'center',
                          width: '100%',
                          textOverflow: 'ellipsis',
                          paddingRight: '14px',
                        }}
                      />
                    </Form.Item>
                  </ColA>
                  <ColA span={1}>
                    <IoIosTrash
                      onClick={() => remove(field.name)}
                      size={20}
                      className="dynamic-delete-button"
                      style={{ marginTop: '5px' }}
                    />
                  </ColA>
                </RowA>
              ))}
              <RowA style={{ justifyContent: 'center' }}>
                <ColA span={14} style={{ alignItems: 'flex-end' }}>
                  <Button
                    variant="codesom"
                    onClick={() => {
                      add();
                    }}
                    style={{
                      color: '#97515F',
                      backgroundColor: 'transparent',
                      borderStyle: 'none',
                    }}>
                    <PlusOutlined />
                  </Button>
                </ColA>
              </RowA>
              {fields.length > 0 && (
                <Form.Item
                  style={{ height: '50px', marginBottom: 0, paddingBottom: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                    className="mb-4">
                    <div style={{ flex: 10 }} />
                    <ButtonA
                      style={{
                        flex: 2,
                        width: '100%',
                        height: 50,
                        borderRadius: '10px',
                        borderWidth: '0',
                        color: 'white',
                        fontSize: '16px',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        backgroundColor: '#2DC678',
                      }}
                      htmlType="submit">
                      ยืนยัน
                    </ButtonA>
                  </div>
                </Form.Item>
              )}
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

const IngrReqList = ({ ...props }) => {
  const [branchData, setbranchData] = useState([]);
  const [selectedBranchId, setBranchId] = useState('');

  useEffect(() => {
    let mounted = true;

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
  useEffect(() => {
    console.log(props.reqData);
  }, [props.reqData]);
  const [form] = Form.useForm();

  const header = [
    {
      title: 'No.',
      dataIndex: 'reqNo',
      align: 'center',
      width: 300,
      defaultValue: 'none',
    },
    {
      title: 'รายการสินค้า',
      dataIndex: 'reqPrName',
      align: 'center',
      width: 300,
    },
    {
      title: 'จำนวน',
      dataIndex: 'reqCount',
      align: 'center',
      width: 100,
    },
    {
      title: 'วัน/เวลาที่สั่ง',
      dataIndex: 'reqTimestamp',
      align: 'center',
      width: 200,
    },
  ];

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
          <FormBS>
            <h2 className="mb-4">
              {props.reqData.length > 0
                ? 'ยืนยันคำขอวัตถุดิบ'
                : 'ร้องขอวัตถุดิบ'}
            </h2>
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <FormBS.Group id="branch">
                  <FormBS.Label>สาขา</FormBS.Label>
                  <FormBS.Select
                    required
                    disabled={props.reqData.length > 0}
                    onChange={e => setBranchId(e.target.value)}>
                    <option value="">เลือกสาขา</option>
                    {branchData.map(option => (
                      <option key={option.brId} value={option.brId}>
                        {option.brName}
                      </option>
                    ))}
                  </FormBS.Select>
                </FormBS.Group>
              </Col>
            </Row>
          </FormBS>
          <Card
            border="light"
            className="bg-white px-1 py-2 mb-4"
            style={{
              borderRadius: '36px',
              borderColor: '#BDBDBD',
              borderWidth: 1,
              fontFamily: 'Prompt',
            }}>
            <Card.Body>
              {props.reqData.length > 0 ? (
                <>
                  <Table
                    dataSource={props.reqData}
                    columns={header}
                    rowKey="reqNo"
                    pagination={{ pageSize: 20 }}
                    style={{ fontFamily: 'Prompt' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                    className="mb-4">
                    <ButtonA
                      style={{
                        flex: 2,
                        width: '100%',
                        height: 50,
                        borderRadius: '10px',
                        borderWidth: '0',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        backgroundColor: '#97515F',
                      }}
                      htmlType="button"
                      onClick={() => {
                        props.setReqData([]);
                      }}>
                      ย้อนกลับ
                    </ButtonA>
                    <div style={{ flex: 8 }} />
                    <ButtonA
                      style={{
                        flex: 2,
                        width: '100%',
                        height: 50,
                        borderRadius: '10px',
                        borderWidth: '0',
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        backgroundColor: '#2DC678',
                      }}
                      htmlType="submit">
                      ยืนยัน
                    </ButtonA>
                  </div>
                </>
              ) : (
                <>
                  <Row className="mb-3">
                    <Col xs={9} style={{ fontWeight: 'bold' }}>
                      รายการสินค้า
                    </Col>
                    <Col
                      xs={3}
                      style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      จำนวน
                    </Col>
                  </Row>
                  <AddReqList
                    form={form}
                    setReqData={props.setReqData}
                    selectedBranchId={selectedBranchId}
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </>
  );
};
export default IngrReqList;
