import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';
import ProductService from 'services/product.service';
import FileService from 'services/file.service';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ManageProductType } from 'components';
import { useAlert } from 'react-alert';

var getData = [];

const ProductCreate = () => {
  const alert = useAlert();
  const [typeData, setTypeData] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productCost, setProductCost] = useState(0);
  const [productType, setProductType] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [needProcess, setNeedProcess] = useState(false);
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const blockInvalidChar = e =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
    fetchProductType();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const fetchProductType = () => {
    ProductService.getAllProductTypes()
      .then(res => {
        getData = res.data;
        setTypeData(getData);
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

  const sendData = () => {
    var data = {
      prName: productName,
      prPrice: productPrice,
      prImg: imgId,
      prType: productType,
      prDetail: productDetail,
    };
    ProductService.createProduct(data)
      .then(res => {
        alert.show(res.data.message, { type: 'success' });
        setProductName();
        setProductPrice(0);
        setProductType();
        setProductDetail();
        setBase64TextString();
        setLoading(false);
        setImgId();
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      alert.show('อัพโหลดได้เฉพาะไฟล์ .jpg .png เท่านั้น!', { type: 'error' });
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      alert.show('ขนาดรูปจะต้องน้อยกว่า 2MB!', { type: 'error' });
    }
    return isJpgOrPng && isLt2M;
  };
  const handleFileChange = e => {
    setLoading(true);
    let file = e.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Make a fileInfo Object
        let fileInfo = {
          name: file.name,
          type: file.type,
          size: Math.round(file.size / 1000) + ' kB',
          base64: reader.result,
          file: file,
        };
        setBase64TextString(fileInfo.base64);
      };
    }
  };
  useEffect(async () => {
    if (base64TextString) {
      await FileService.upload(base64TextString)
        .then(res => {
          if (res && res.data) {
            setImgId(res.data.imgId);
            console.log(res.data.imgId);
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
    }
  }, [base64TextString]);
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
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-4">ข้อมูลสินค้า / Goods Info</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Upload
                  name="productImg"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  customRequest={() => {}}
                  beforeUpload={beforeUpload}
                  onChange={handleFileChange}>
                  {base64TextString ? (
                    <img
                      src={base64TextString}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
                <Row>
                  <Form.Group id="ItemNo">
                    <Form.Label>คำอธิบายของสินค้า</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      rows={4}
                      placeholder="คำอธิบายของสินค้า"
                      name="productDetail"
                      style={{ resize: 'none' }}
                      value={productDetail}
                      onChange={e => setProductDetail(e.target.value)}
                    />
                  </Form.Group>
                </Row>
              </Col>
              <Col md={6} className="mb-3">
                <Row>
                  <Col className="mb-3">
                    <Form.Group id="ItemNo">
                      <Form.Label>ชื่อสินค้า</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="ชื่อสินค้า"
                        name="productName"
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>ราคาทุน</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        value={productCost}
                        name="productCost"
                        onWheel={event => event.currentTarget.blur()}
                        onKeyDown={blockInvalidChar}
                        onChange={e =>
                          setProductCost(parseFloat(e.target.value).toFixed(2))
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>ราคาขาย</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        value={productPrice}
                        name="productPrice"
                        onWheel={event => event.currentTarget.blur()}
                        onKeyDown={blockInvalidChar}
                        onChange={e =>
                          setProductPrice(parseFloat(e.target.value).toFixed(2))
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>
                        ชนิดสินค้า{' '}
                        <ManageProductType
                          typeData={typeData}
                          fetchProductType={fetchProductType}
                        />
                      </Form.Label>
                      <Form.Select
                        required
                        name="productType"
                        value={productType}
                        onChange={e => setProductType(e.target.value)}>
                        <option>ชนิดสินค้า</option>
                        {typeData.map(option => (
                          <option key={option.typeId} value={option.typeId}>
                            {option.typeName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Switch
                        label="Process"
                        onChange={e => {
                          setNeedProcess(e.target.checked);
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 3, offset: 6 }}>
                <div>
                  <Button
                    variant="outline-secondary"
                    onClick={() => history.back()}
                    style={{ width: '100%', borderWidth: 0 }}>
                    ย้อนกลับ
                  </Button>
                </div>
              </Col>
              <Col md={3}>
                <div>
                  <Button
                    variant="tertiary"
                    type="submit"
                    style={{ width: '100%', color: 'white' }}>
                    ยืนยัน
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductCreate;
