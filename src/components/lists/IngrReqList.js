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
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Preloader } from 'components';
// services
import BranchesService from 'services/branches.service';
import requisitionService from 'services/requisition.service';

var getBranchData = [];
const { Option } = Select;

const AddReqList = ({ ...props }) => {
  const alert = useAlert();
  const onFinish = values => {
    var inputData = values.requisitionItems;
    var tempData = [];
    var isDuplicate = false;

    const uniqueValues = new Set(inputData.map(v => v.reqItemKey));

    if (uniqueValues.size < inputData.length) {
      isDuplicate = true;
    }

    if (isDuplicate)
      return alert.show('ทำรายการไม่สำเร็จ เนื่องจากมีการใช้วัตถุดิบซ้ำกัน', {
        type: 'error',
      });

    if (
      props.selectedBranchId != undefined ||
      props.selectBranch != undefined
    ) {
      inputData.forEach(obj => {
        props.availableItem.forEach(data => {
          if (obj.reqItemKey == data.key) {
            var pushData = {
              id: data.id,
              name: data.name,
              unit: data.unit,
              type: data.type,
              key: data.key,
              quantity: obj.reqCount,
            };
            tempData.push(pushData);
          }
        });
      });
      props.setReqData(tempData);
    } else {
      alert.show('เลือกสาขาก่อนทำการยืนยัน', { type: 'error' });
    }
  };

  return (
    <Form form={props.form} name="reqIngrForm" onFinish={onFinish}>
      <Form.List name="requisitionItems">
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <RowA key={key} style={{ height: '100%' }}>
                    <ColA span={12}>
                      <Form.Item
                        name={[name, 'reqItemKey']}
                        {...restField}
                        rules={[{ required: true, message: '*เลือกรายการ' }]}>
                        <Select
                          placeholder="กดเพื่อเลือกรายการ"
                          dropdownStyle={{ fontFamily: 'Prompt' }}>
                          {props.availableItem.map((item, index) => (
                            <Option key={index} value={item.key}>
                              {item.name} ({item.unit}) ({item.type})
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </ColA>
                    <ColA span={7} />
                    <ColA span={4} style={{ textAlign: 'center' }}>
                      <Form.Item
                        name={[name, 'reqCount']}
                        {...restField}
                        rules={[{ required: true, message: 'ใส่จำนวน' }]}>
                        <InputNumber
                          min="1"
                          max="1000"
                          placeholder="0"
                          style={{
                            textAlign: 'center',
                            width: '100%',
                            textOverflow: 'ellipsis',
                          }}
                        />
                      </Form.Item>
                    </ColA>
                    <ColA span={1}>
                      <IoIosTrash
                        onClick={() => remove(name)}
                        size={20}
                        className="dynamic-delete-button"
                        style={{ marginTop: 10 }}
                      />
                    </ColA>
                  </RowA>
                );
              })}
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
                    <div style={{ flex: 1 }} />
                    <ButtonA
                      type="primary"
                      htmlType="submit"
                      style={{ width: 140 }}>
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
  const alert = useAlert();
  const { selectBranch } = props;
  const { promiseInProgress } = usePromiseTracker();
  const [branchData, setbranchData] = useState([]);
  const [selectedBranchId, setBranchId] = useState(undefined);
  const [availableItem, setAvailableItem] = useState([]);
  const sendData = () => {
    var prepareData = {
      reqHeader: {
        creatorId: JSON.parse(localStorage.getItem('user')).authPayload.empId,
        itemCount: props.reqData.length,
      },
      requisitionItems: props.reqData,
    };
    if (selectBranch != null) {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              requisitionService
                .createRequisit(prepareData, selectBranch)
                .then(res => {
                  if (res.data && res.data.message) {
                    alert.show(res.data.message, { type: 'success' });
                    props.setReqData([]);
                    setBranchId(undefined);
                    form.resetFields();
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
                }),
            );
          }, 2000);
        }),
      );
    } else {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              requisitionService
                .createRequisit(prepareData, selectedBranchId)
                .then(res => {
                  if (res.data && res.data.message) {
                    alert.show(res.data.message, { type: 'success' });
                    props.setReqData([]);
                    setBranchId(undefined);
                    form.resetFields();
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
                }),
            );
          }, 2000);
        }),
      );
    }
  };
  useEffect(() => {
    let mounted = true;
    if (selectBranch == null)
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
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
                }),
            );
          }, 1000);
        }),
      );
    return () => (mounted = false);
  }, []);
  useEffect(() => {
    if (selectBranch != null) {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              requisitionService
                .getItemMakeRequest(selectBranch)
                .then(res => setAvailableItem(res.data))
                .catch(error => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  alert.show(resMessage, { type: 'error' });
                }),
            );
          }, 1000);
        }),
      );
    } else {
      void trackPromise(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              requisitionService
                .getItemMakeRequest(selectedBranchId)
                .then(res => setAvailableItem(res.data))
                .catch(error => {
                  const resMessage =
                    (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                    error.message ||
                    error.toString();
                  alert.show(resMessage, { type: 'error' });
                }),
            );
          }, 1000);
        }),
      );
    }
  }, [selectedBranchId, selectBranch]);
  const [form] = Form.useForm();

  const header = [
    {
      title: 'No.',
      dataIndex: 'id',
      align: 'center',
      width: 120,
      defaultValue: 'none',
    },
    {
      title: 'ประเภท',
      dataIndex: 'type',
      align: 'center',
      width: 100,
    },
    {
      title: 'รายการสินค้า',
      dataIndex: 'name',
      align: 'center',
      width: 300,
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <div>
          {text} {record.unit}
        </div>
      ),
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
          <h2 className="mb-3">
            {props.reqData.length > 0 ? 'ตรวจสอบรายการ' : 'สร้างใบเบิกสินค้า'}
          </h2>
          {selectBranch == null && (
            <Row>
              <Col md={6} xl={6} className="mb-3">
                <Select
                  showSearch
                  label="สาขา"
                  value={selectedBranchId}
                  loading={promiseInProgress}
                  disabled={props.reqData.length > 0}
                  style={{ width: 300, fontFamily: 'Prompt' }}
                  placeholder="เลือกสาขา"
                  optionFilterProp="children"
                  dropdownStyle={{ fontFamily: 'Prompt' }}
                  onChange={value => setBranchId(value)}>
                  {branchData.map(option => (
                    <Option key={option.branchId} value={option.branchId}>
                      {option.branchName} ({option.branchId})
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          )}

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
                    loading={promiseInProgress}
                    rowKey="id"
                    pagination={false}
                    style={{ fontFamily: 'Prompt' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                    }}
                    className="mt-4 mb-4">
                    <ButtonA
                      ghost
                      danger
                      onClick={() => {
                        props.setReqData([]);
                      }}
                      style={{ flex: 2 }}>
                      ย้อนกลับ
                    </ButtonA>
                    <div style={{ flex: 8 }} />
                    <ButtonA
                      type="primary"
                      onClick={() => {
                        sendData();
                      }}
                      style={{ flex: 2 }}>
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
                    availableItem={availableItem}
                    selectBranch={selectBranch}
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
