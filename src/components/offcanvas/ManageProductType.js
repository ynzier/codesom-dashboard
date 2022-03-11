import React, { useState } from 'react';
import ProductService from 'services/product.service';
import { Col, Form, Button, Offcanvas, InputGroup } from 'react-bootstrap';
import { Table } from 'antd';
import { useAlert } from 'react-alert';
const ManageProductType = ({ fetchProductType, typeData, ...props }) => {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const [newType, setNewType] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const header = [
    {
      title: 'ชนิดสินค้า',
      dataIndex: 'typeName',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'typeId',
      align: 'center',
      dataIndex: 'typeId',
      render: (text, record) => {
        return (
          <div>
            <span
              onClick={() => {
                ProductService.disableType(record.typeId)
                  .then(response => {
                    fetchProductType();

                    alert.show(response.data.message, { type: 'success' });
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
              }}>
              <i className="fas fa-trash action"></i>
            </span>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <a style={{ color: '#c4c4c4', fontSize: 12 }} onClick={handleShow}>
        เพิ่มเติม
      </a>
      <Offcanvas show={show} placement="end" onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>จัดการชนิดสินค้า</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Col md={{ span: 6, offset: 6 }} className="mb-3">
            <Form.Group id="firstname">
              <InputGroup>
                <Form.Control
                  type="text"
                  maxLength="40"
                  placeholder="เพิ่มชนิดสินค้า"
                  onChange={e => setNewType(e.target.value)}
                />
                <Button
                  variant="outline-tertiary"
                  style={{ zIndex: 5 }}
                  onClick={e => {
                    console.log(newType);
                    ProductService.createType(newType)
                      .then(response => {
                        fetchProductType();
                        alert.show(response.data.message, { type: 'success' });

                        e.disabled = true;
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
                  }}>
                  เพิ่ม
                </Button>
              </InputGroup>
            </Form.Group>
          </Col>
          <Table
            dataSource={typeData}
            columns={header}
            rowKey="typeId"
            pagination={false}
            style={{
              fontFamily: 'Prompt',
              marginLeft: '20px',
              marginRight: '20px',
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default ManageProductType;
