import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Card, Form, Button, InputGroup } from 'react-bootstrap';
import ProductService from 'services/product.service';
import FileService from 'services/file.service';
import storageService from 'services/storage.service';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { IoIosTrash } from 'react-icons/io';
import {
  Col as ColA,
  Row as RowA,
  Form as FormA,
  InputNumber,
  Select,
  Upload,
  Button as ButtonA,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ManageProductType } from 'components';
import { useAlert } from 'react-alert';
import ingredientService from 'services/ingredient.service';
import productService from 'services/product.service';

var getData = [];

const ProductCreate = () => {
  const alert = useAlert();
  const [form] = FormA.useForm();
  const { Option } = Select;
  const { promiseInProgress } = usePromiseTracker({});
  const [dataIngrStuff, setDataIngrStuff] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [needProcess, setNeedProcess] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('0');
  const [productCost, setProductCost] = useState('0');
  const [productType, setProductType] = useState();
  const [productDetail, setProductDetail] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [base64TextString, setBase64TextString] = useState();
  const [recipeData, setRecipeData] = useState();
  const [recipeEdit, setRecipeEdit] = useState(true);
  const [imgId, setImgId] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
    fetchProductType();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!needProcess) sendData();
    else {
      sendRecipeProduct();
    }
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
  const fetchforRecipe = useCallback(() => {
    trackPromise(
      ingredientService
        .ingredientForRecipe()
        .then(res => {
          setDataIngrStuff(res.data.data);
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
        setProductCost('0.00');
        setProductPrice('0.00');
        setProductType();
        setProductDetail();
        setBase64TextString();
        setLoading(false);
        setImgId();
        history.back();
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

  const sendRecipeProduct = async () => {
    var data = {
      productData: {
        prName: productName,
        prPrice: productPrice,
        prImg: imgId,
        prType: productType,
        prDetail: productDetail,
        needProcess: needProcess,
      },
      recipeData: { description: recipeDescription, ingredients: recipeData },
    };
    ProductService.createProductWithRecipe(data)
      .then(res => {
        alert.show(res.data.message, { type: 'success' });
        setProductName();
        setProductCost('0.00');
        setProductPrice('0.00');
        setProductType();
        setRecipeData([]);
        setProductDetail();
        setBase64TextString();
        setLoading(false);
        setImgId();
        history.back();
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

  useEffect(() => {
    if (needProcess && dataIngrStuff.length < 1) {
      fetchforRecipe();
    }
    if (!needProcess) {
      form.resetFields();
    }
    return () => {};
  }, [needProcess]);

  return (
    <>
      <Col xs={12} md={8}>
        <Card
          border="light"
          className="bg-white px-6 py-4"
          style={{
            borderRadius: '36px',
            boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
            fontFamily: 'Prompt',
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
                        rows={3}
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
                        <InputGroup>
                          <InputNumber
                            min="0"
                            precision="2"
                            stringMode
                            required
                            value={productCost}
                            placeholder="0.00"
                            style={{
                              borderRadius: 8,
                              borderColor: '#e8e8e8',
                              height: 43.59,
                              padding: 5,
                              width: 200,
                            }}
                            onChange={value => setProductCost(value)}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group id="modelID">
                        <Form.Label>ราคาขาย</Form.Label>
                        <InputGroup>
                          <InputNumber
                            min="0"
                            precision="2"
                            stringMode
                            required
                            value={productPrice}
                            placeholder="0.00"
                            style={{
                              borderRadius: 8,
                              borderColor: '#e8e8e8',
                              height: 43.59,
                              padding: 5,
                              width: 200,
                            }}
                            onChange={value => setProductPrice(value)}
                          />
                        </InputGroup>
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
                          label="การผสม"
                          value={needProcess}
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
      </Col>
      <Col md={4}>
        <Card
          border="light"
          className="bg-white px-2 py-4"
          style={{
            borderRadius: '36px',
            boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
            fontFamily: 'Prompt',
            display: needProcess ? 'block' : 'none',
          }}>
          <Card.Body>
            <h5 className="mb-4">ข้อมูลการผสม / Recipe</h5>
            <Row>
              <Form.Group id="ItemNo">
                <Form.Label>คำอธิบายการผสม</Form.Label>
                <Form.Control
                  type="text"
                  as="textarea"
                  rows={3}
                  disabled={!recipeEdit}
                  placeholder="คำอธิบายการผสม"
                  name="recipeDescription"
                  style={{ resize: 'none' }}
                  value={recipeDescription}
                  onChange={e => setRecipeDescription(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3 mt-3">
              <Col xs={9} style={{ fontWeight: 'bold' }}>
                ส่วนผสม
              </Col>
              <Col xs={3} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                ปริมาณ
              </Col>
            </Row>
            <FormA
              form={form}
              name="addRecipeForm"
              preserve={false}
              onFinish={values => {
                var isDuplicate = false;
                if (recipeEdit) {
                  if (values.RecipeItem) {
                    const uniqueValues = new Set(
                      values.RecipeItem.map(v => v.ingrId),
                    );

                    if (uniqueValues.size < values.RecipeItem.length) {
                      isDuplicate = true;
                    }
                  }
                  if (!isDuplicate) setRecipeData(values.RecipeItem);
                  if (isDuplicate)
                    return alert.show(
                      'ทำรายการไม่สำเร็จ เนื่องจากมีการใช้วัตถุดิบซ้ำกัน',
                      { type: 'error' },
                    );
                }
                setRecipeEdit(!recipeEdit);
              }}>
              <FormA.List name="RecipeItem">
                {(fields, { add, remove }, { error }) => {
                  return (
                    <>
                      {fields.map((field, index) => {
                        return (
                          <RowA key={field.key} style={{ height: '100%' }}>
                            <ColA span={16}>
                              <FormA.Item
                                name={[index, 'ingrId']}
                                rules={[
                                  { required: true, message: '*เลือกรายการ' },
                                ]}>
                                <Select
                                  placeholder="กดเพื่อเลือกรายการ"
                                  disabled={!recipeEdit}
                                  value={[index, 'ingrId']}
                                  dropdownStyle={{ fontFamily: 'Prompt' }}>
                                  {dataIngrStuff.map((item, index) => (
                                    <Option key={index} value={item.id}>
                                      {item.name} ({item.unit})
                                    </Option>
                                  ))}
                                </Select>
                              </FormA.Item>
                            </ColA>
                            <ColA span={1} />
                            <ColA span={6} style={{ textAlign: 'center' }}>
                              <FormA.Item
                                name={[index, 'amountRequired']}
                                rules={[
                                  { required: true, message: 'ใส่จำนวน' },
                                ]}>
                                <InputNumber
                                  min="1"
                                  max="1000"
                                  disabled={!recipeEdit}
                                  style={{
                                    textAlign: 'center',
                                    width: '100%',
                                    textOverflow: 'ellipsis',
                                  }}
                                />
                              </FormA.Item>
                            </ColA>
                            <ColA span={1}>
                              <IoIosTrash
                                onClick={() => remove(field.name)}
                                size={20}
                                className="dynamic-delete-button"
                                style={{ marginTop: '5px', float: 'right' }}
                              />
                            </ColA>
                          </RowA>
                        );
                      })}
                      <RowA style={{ justifyContent: 'center' }}>
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
                      </RowA>
                      {fields.length > 0 && (
                        <FormA.Item
                          style={{
                            height: '50px',
                            marginBottom: 0,
                            paddingBottom: 0,
                          }}>
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
                              {recipeEdit ? 'ยืนยัน' : 'แก้ไข'}
                            </ButtonA>
                          </div>
                        </FormA.Item>
                      )}
                    </>
                  );
                }}
              </FormA.List>
            </FormA>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default ProductCreate;
