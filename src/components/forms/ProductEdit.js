import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button, InputGroup } from 'react-bootstrap';
import ProductService from 'services/product.service';
import FileService from 'services/file.service';
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ManageProductType, ProductBranchSetting } from 'components';
import Switch from 'react-switch';

const ProductEdit = ({ generate, prId }) => {
  const [editable, setEditable] = useState(false);
  const [typeData, setTypeData] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productType, setProductType] = useState('');
  const [productDetail, setProductDetail] = useState('');
  const [productStatus, setProductStatus] = useState('');
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
          setProductStatus(getData.prStatus);
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

  const sendData = () => {
    var data = {
      prName: productName,
      prPrice: productPrice,
      prImg: imgId,
      prType: productType,
      prDetail: productDetail,
      prStatus: productStatus,
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
                            generate={generate}
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
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>รหัสเมนู</Form.Label>
                      <Form.Control
                        required
                        disabled
                        type="number"
                        value={prId}
                        name="productId"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3" style={{ alignItems: 'center' }}>
                    <Form.Label>สถานะ</Form.Label>
                    <InputGroup>
                      <Switch
                        disabled={!editable}
                        onChange={() => {
                          if (productStatus == 'AVAILABLE')
                            return setProductStatus('UNAVAILABLE');
                          setProductStatus('AVAILABLE');
                        }}
                        checked={productStatus == 'AVAILABLE' ? true : false}
                        className="react-switch"
                        width={98}
                        height={42}
                        handleDiameter={42}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        offColor="#D8434B"
                        onColor="#2DC678"
                        checkedIcon={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                              fontSize: 15,
                              color: '#fffdfa',
                              fontFamily: 'Prompt',
                              paddingRight: 2,
                            }}>
                            พร้อม
                          </div>
                        }
                        uncheckedIcon={
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              height: '100%',
                              fontSize: 15,
                              fontFamily: 'Prompt',
                              color: '#fffdfa',
                              paddingRight: 2,
                            }}>
                            ระงับ
                          </div>
                        }
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col>
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
            <Row className="mb-2">
              <Col md={{ span: 2, offset: 10 }}>
                <ProductBranchSetting
                  typeData={typeData}
                  fetchProductType={fetchProductType}
                  generate={generate}
                  editable={editable}
                />
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
