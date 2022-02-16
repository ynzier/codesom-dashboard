import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';
import { AlertList } from 'react-bs-notifier';
import ProductService from 'services/product.service';
import FileService from 'services/file.service';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ManageProductType } from 'components';

const ProductEdit = ({ prId }) => {
  const [editable, setEditable] = useState(false);
  const [typeData, setTypeData] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productType, setProductType] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [imgId, setImgId] = useState();
  const [base64TextString, setBase64TextString] = useState();
  const blockInvalidChar = e =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    document.title = 'ข้อมูลสินค้า';
    if (prId) {
      await fetchProductData(prId);
      await fetchProductType();
    }
  }, [prId]);

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const fetchProductData = async prId => {
    await ProductService.getProductById(prId)
      .then(res => {
        if (res.data) {
          var getData = res.data;
          setProductName(getData.prName);
          setProductPrice(getData.prPrice);
          setProductType(getData.prType);
          setProductDetail(getData.prDetail);
          setImgId(getData.prImg);
          setBase64TextString(getData.image.imgObj);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const fetchProductType = async () => {
    await ProductService.getAllProductTypes()
      .then(res => {
        var getData = res.data;
        setTypeData(getData);
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
  const sendData = () => {
    var data = {
      prName: productName,
      prPrice: productPrice,
      prImg: imgId,
      prType: productType,
      prDetail: productDetail,
    };
    ProductService.updateProduct(prId, data)
      .then(res => {
        generate('success', res.data.message);
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

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      generate('danger', 'อัพโหลดได้เฉพาะไฟล์ .jpg .png เท่านั้น!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      generate('danger', 'ขนาดรูปจะต้องน้อยกว่า 2MB!');
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
    if (editable) {
      await FileService.upload(base64TextString)
        .then(res => {
          if (res && res.data) {
            setImgId(res.data.imgId);
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
  }, [base64TextString]);
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
            <h5 className="mb-4">ข้อมูลสินค้า / Goods Info</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Upload
                  name="productImg"
                  disabled={!editable}
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
              </Col>
              <Col md={6} className="mb-3">
                <Row>
                  <Col className="mb-3">
                    <Form.Group id="ItemNo">
                      <Form.Label>ชื่อสินค้า</Form.Label>
                      <Form.Control
                        required
                        disabled={!editable}
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
                  <Col md={4} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>ราคาทุน</Form.Label>
                      <Form.Control
                        required
                        disabled={!editable}
                        type="number"
                        value={productPrice}
                        name="productPrice"
                        onWheel={event => event.currentTarget.blur()}
                        onKeyDown={blockInvalidChar}
                        onChange={e => setProductPrice(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>
                        ชนิดสินค้า{' '}
                        {editable && (
                          <ManageProductType
                            typeData={typeData}
                            fetchProductType={fetchProductType}
                            Alert={generate}
                          />
                        )}
                      </Form.Label>
                      <Form.Select
                        required
                        disabled={!editable}
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
              </Col>
            </Row>
            <Row>
              <Col className="mb-4">
                <Form.Group id="ItemNo">
                  <Form.Label>คำอธิบายของสินค้า</Form.Label>
                  <Form.Control
                    disabled={!editable}
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
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 3 }}>
                <div>
                  <Button
                    variant="outline-codesom"
                    onClick={() => history.back()}
                    style={{ width: '100%' }}>
                    ย้อนกลับ
                  </Button>
                </div>
              </Col>
              <Col md={{ span: 3, offset: 3 }}>
                <div>
                  {!editable ? (
                    <Button
                      variant="outline-danger"
                      onClick={() => {}}
                      style={{
                        borderRadius: '10px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                      }}>
                      ลบ
                    </Button>
                  ) : (
                    <Button
                      variant="outline-danger"
                      onClick={() => {
                        fetchProductData(prId);
                        setEditable(!editable);
                      }}
                      style={{
                        borderRadius: '10px',
                        width: '100%',
                        boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                        color: 'white',
                      }}>
                      ยกเลิก
                    </Button>
                  )}
                </div>
              </Col>
              <Col md={3}>
                <div>
                  {!editable ? (
                    <Button
                      variant="tertiary"
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

export default ProductEdit;
