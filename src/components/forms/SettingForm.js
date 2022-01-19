import React, { useState, useEffect } from 'react';
import ProductService from 'services/product.service';
import { Table } from 'antd';
import 'antd/dist/antd.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup, Button } from 'react-bootstrap';

export const SettingForm = props => {
  const [brandData, setBrandData] = useState();
  const [typeData, setTypeData] = useState();
  const [input, setInput] = useState();
  const [type, setType] = useState();
  useEffect(() => {
    let mounted = true;
    ProductService.getBrand()
      .then(res => {
        if (mounted) {
          setBrandData(res.data);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
    ProductService.getProductType()
      .then(res => {
        if (mounted) {
          setTypeData(res.data);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
    return () => (mounted = false);
  }, []);

  const refreshList = () => {
    ProductService.getBrand()
      .then(res => {
        setBrandData(res.data);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });

    ProductService.getProductType()
      .then(res => {
        setTypeData(res.data);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const sendData = () => {
    var data = {
      name: input,
    };
    ProductService.addBrand(data)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const deleteBrand = id => {
    ProductService.deleteBrand(id)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const deleteProductType = id => {
    ProductService.deleteProductType(id)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const sendTypeData = () => {
    var data = {
      category: type,
    };
    ProductService.addProductType(data)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };

  const header = [
    {
      title: 'แบรนด์',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => {
        const id = record.id;

        return (
          <div>
            <span
              onClick={() => {
                deleteBrand(id);
              }}>
              <i className="fas fa-trash action"></i>
            </span>
          </div>
        );
      },
    },
  ];
  const typeHeader = [
    {
      title: 'ชนิดสินค้า',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => {
        const id = record.prod_type;

        return (
          <div>
            <span
              onClick={() => {
                deleteProductType(id);
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
      <div className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">เพิ่ม / ลบ แบรนด์</h5>
        <InputGroup className="mb-md-0" style={{ width: '30%' }}>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faPlus} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="ชื่อแบรนด์"
            onChange={e => setInput(e.target.value)}
          />
          <Button onClick={sendData}>เพิ่ม</Button>
        </InputGroup>
      </div>
      <Table
        dataSource={brandData ? brandData : null}
        columns={header}
        rowkey="id"
      />
      <div className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">เพิ่ม / ลบ ชนิดสินค้า</h5>
        <InputGroup className="mb-md-0" style={{ width: '30%' }}>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faPlus} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="ชนิดสินค้า"
            onChange={e => setType(e.target.value)}
          />
          <Button onClick={sendTypeData}>เพิ่ม</Button>
        </InputGroup>
      </div>
      <Table
        dataSource={typeData ? typeData : null}
        columns={typeHeader}
        rowkey="prod_type"
      />
    </>
  );
};
