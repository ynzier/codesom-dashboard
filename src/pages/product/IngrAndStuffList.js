import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Table, Input, Button, Select, Form, InputNumber } from 'antd';
import { useAlert } from 'react-alert';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Breadcrumb, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { Routes } from 'routes';
import { IngrStffCreateModal } from 'components';
import storageService from 'services/storage.service';
import ingredientService from 'services/ingredient.service';
import stuffService from 'services/stuff.service';

const { Option } = Select;

const IngrStuffEditForm = ({ data, closeModal }) => {
  const [formData, setFormData] = useState(undefined);
  const alert = useAlert();
  const [form] = Form.useForm();
  useEffect(() => {
    if (data != undefined) {
      if (data.type == 'วัตถุดิบ')
        ingredientService
          .getIngredientById(data.id)
          .then(res => {
            const recData = res.data;
            setFormData({
              name: recData.ingrName,
              unit: recData.ingrUnit,
              cost: recData.ingrCost,
              type: 'วัตถุดิบ',
            });
            form.resetFields();
          })
          .catch(err => console.log(err));

      if (data.type == 'อื่นๆ')
        stuffService
          .getStuffById(data.id)
          .then(res => {
            const recData = res.data;
            setFormData({
              name: recData.stuffName,
              unit: recData.stuffUnit,
              cost: recData.stuffCost,
              type: 'อื่นๆ',
            });
            form.resetFields();
          })
          .catch(err => console.log(err));
    }

    return () => {};
  }, [data]);
  const handleSubmit = e => {
    if (e.type == 'วัตถุดิบ') {
      var ingrData = {
        ingrName: e.name,
        ingrUnit: e.unit,
        ingrCost: e.cost,
      };
      ingredientService
        .updateIngredient(data.id, ingrData)
        .then(res => {
          alert.show(res.data.message, { type: 'success' });
          closeModal();
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
        .updateStuff(data.id, stuffData)
        .then(res => {
          alert.show(res.data.message, { type: 'success' });
          closeModal();
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
  };

  return (
    <>
      <Form
        form={form}
        name="createIngrStff"
        preserve={false}
        layout="vertical"
        initialValues={formData}
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
                    disabled
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
          <div>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: 130, float: 'right' }}>
              ยืนยัน
            </Button>
          </div>
        </Row>
      </Form>
    </>
  );
};

const IngrAndStuffList = () => {
  let location = useLocation();
  const alert = useAlert();

  const { promiseInProgress } = usePromiseTracker({
    area: storageService.area.getDashboardIngrStuffList,
  });
  const [showCreate, setShowCreate] = useState(false);
  const [record, setRecord] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(undefined);
  const [filterData, setfilterData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState('');

  useEffect(async () => {
    const filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == '')
        return Object.keys(obj).some(k =>
          String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
        );
      // option
      if (keyword == '' && option != '') return obj.type == option;
      // keyword option
      if (keyword != '' && option != '')
        return (
          obj.type == option &&
          Object.keys(obj).some(k =>
            String(obj[k]).toLowerCase().includes(keyword.toLowerCase()),
          )
        );
    });
    setfilterData(filterTable);
    return () => {};
  }, [keyword, option]);

  const fetchData = useCallback(() => {
    trackPromise(
      storageService
        .getDashboardIngrStuffList()
        .then(res => {
          setRecord(res.data);
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
      storageService.area.getDashboardIngrStuffList,
    );
  });
  useEffect(async () => {
    document.title = 'วัตถุดิบและอื่นๆ';
    fetchData();
    return () => {};
  }, []);

  const header = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
      align: 'center',
      width: 200,
      render: (text, record) => (
        <>
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              setEditId({ id: text, type: record.type });
              setShowEdit(true);
            }}>
            {text}
            <FiEdit style={{ marginLeft: 8, marginBottom: 4 }} />
          </a>
        </>
      ),
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      align: 'center',
      width: 300,
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'type',
      align: 'center',
      width: 300,
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
      align: 'center',
      width: 200,
    },
  ];
  const headerManager = [
    {
      title: 'รหัสสินค้า',
      dataIndex: 'id',
      align: 'center',
      width: 200,
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'name',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <>
            <div
              style={{
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              {record.name}
            </div>
          </>
        );
      },
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'type',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return <div>{record.type}</div>;
      },
    },
    {
      title: 'หน่วย',
      dataIndex: 'unit',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>{record.unit}</div>;
      },
    },
  ];
  return (
    <>
      {showCreate && (
        <IngrStffCreateModal
          showCreate={showCreate}
          setShowCreate={setShowCreate}
          fetchData={fetchData}
        />
      )}
      {showEdit && (
        <Modal
          show={showEdit}
          onHide={() => {
            setEditId(undefined);
            setShowEdit(false);
          }}
          centered>
          <Modal.Header closeButton>
            <Modal.Title>แก้ไขข้อมูล</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <IngrStuffEditForm
              data={editId}
              closeModal={() => {
                setEditId(undefined);
                fetchData();
                setShowEdit(false);
              }}
            />
          </Modal.Body>
        </Modal>
      )}
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item>
              <Link to={Routes.Home.path}>
                <FontAwesomeIcon icon={faHome} />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>วัตถุดิบและอื่นๆ</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings mb-1">
            <Row>
              <Col xs={8} md={6} lg={3} xl={4}>
                <Input
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="ค้นหาชื่อวัตถุดิบ / รหัสวัตถุดิบ"
                />
              </Col>
              <Col xs={4} md={4} xl={3}>
                <Select
                  className="mb-3"
                  style={{
                    width: 300,
                    fontFamily: 'Prompt',
                  }}
                  placeholder="ประเภท"
                  dropdownStyle={{ fontFamily: 'Prompt' }}
                  onChange={value => {
                    setOption(value);
                  }}>
                  <Option value="วัตถุดิบ">วัตถุดิบ</Option>
                  <Option value="อื่นๆ">อื่นๆ</Option>
                </Select>
              </Col>
              {!location.state?.isManager && (
                <Col xs={5} xl={{ span: 2, offset: 3 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setShowCreate(true);
                    }}>
                    เพิ่มรายการ
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            dataSource={keyword != '' || option != '' ? filterData : record}
            columns={location.state?.isManager ? headerManager : header}
            rowKey="productId"
            loading={promiseInProgress}
            pagination={{ pageSize: 20, showSizeChanger: false }}
            style={{
              fontFamily: 'Prompt',
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default IngrAndStuffList;
