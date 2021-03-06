import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import ProductService from 'services/product.service';
import FileService from 'services/file.service';
import storageService from 'services/storage.service';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { IoIosTrash } from 'react-icons/io';
import {
  Col as ColA,
  Row as RowA,
  Form,
  InputNumber,
  Select,
  Input,
  Upload,
  Button as ButtonA,
  Switch,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ManageProductType } from 'components';
import { useAlert } from 'react-alert';
import ingredientService from 'services/ingredient.service';

var getData = [];

const ProductCreate = () => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { promiseInProgress } = usePromiseTracker({});
  const [dataIngrStuff, setDataIngrStuff] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [needProcess, setNeedProcess] = useState(false);
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const [loading, setLoading] = useState(false);
  const [productCost, setProductCost] = useState(0);

  useEffect(() => {
    fetchProductType();
  }, []);

  const handleSubmit = values => {
    if (needProcess) {
      var isDuplicate = false;
      if (values.RecipeItem) {
        const uniqueValues = new Set(values.RecipeItem.map(v => v.ingrId));

        if (uniqueValues.size < values.RecipeItem.length) {
          isDuplicate = true;
        }
      }
      if (isDuplicate)
        return alert.show('ทำรายการไม่สำเร็จ เนื่องจากมีการใช้วัตถุดิบซ้ำกัน', {
          type: 'error',
        });

      sendRecipeProduct(values);
    }
    if (!needProcess) sendData(values);
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
  const sendData = e => {
    var data = {
      productName: e.productName,
      productCost: e.productCost,
      productPrice: e.productPrice,
      productImg: imgId,
      productType: e.productType,
      productUnit: e.productUnit,
      productDetail: e.productDetail,
    };
    ProductService.createProduct(data)
      .then(res => {
        alert.show(res.data.message, { type: 'success' });
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

  const sendRecipeProduct = async e => {
    var data = {
      productData: {
        productName: e.productName,
        productCost: productCost,
        productPrice: e.productPrice,
        productImg: imgId,
        productType: e.productType,
        productDetail: e.productDetail,
        productUnit: e.productUnit,
        needProcess: needProcess,
      },
      recipeData: {
        description: e.recipeDescription,
        ingredients: e.RecipeItem,
      },
    };
    ProductService.createProductWithRecipe(data)
      .then(res => {
        alert.show(res.data.message, { type: 'success' });
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
      <Form
        form={form}
        name="addPromotion"
        preserve={false}
        layout="vertical"
        onValuesChange={(_, value) => {
          if (value.RecipeItem) {
            let sumCost = 0;
            value.RecipeItem.forEach(e => {
              if (e != undefined && e.ingrId && e.amountRequired) {
                const price = dataIngrStuff.filter(data => data.id == e.ingrId);
                sumCost = sumCost + price[0].cost * e.amountRequired;
              }
            });
            setProductCost(sumCost);
          }
        }}
        onFinish={values => {
          handleSubmit(values);
        }}>
        <Row>
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
                <h5 className="mb-4">เพิ่มสินค้า</h5>
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
                      <Form.Item
                        name="productDetail"
                        label="คำอธิบายของสินค้า"
                        rules={[
                          { max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' },
                        ]}>
                        <Input.TextArea
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          placeholder="คำอธิบายของสินค้า"
                        />
                      </Form.Item>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Item
                          name="needProcess"
                          label="การผสม"
                          valuePropName="checked">
                          <Switch
                            onChange={e => {
                              setNeedProcess(e);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Row>
                      <Col className="mb-3">
                        <Form.Item
                          name="productName"
                          label="ชื่อสินค้า"
                          rules={[
                            { required: true, message: '*ใส่ชื่อสินค้า' },
                            { max: 30, message: '*ไม่เกิน 30 ตัวอักษร' },
                          ]}>
                          <Input placeholder="ชื่อสินค้า" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        {needProcess ? (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 9 }}>
                              ราคาทุน
                            </div>
                            <InputNumber
                              min="0"
                              style={{ width: '100%' }}
                              precision="2"
                              stringMode
                              placeholder="0.00"
                              disabled={needProcess}
                              value={productCost}
                            />
                          </div>
                        ) : (
                          <Form.Item
                            name="productCost"
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
                        )}
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Item
                          name="productPrice"
                          label="ราคาขาย"
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
                      <Col md={12} className="mb-3">
                        <Form.Item
                          name={'productType'}
                          label={[
                            <div key="type1">ชนิดสินค้า </div>,
                            <ManageProductType
                              key="type2"
                              typeData={typeData}
                              fetchProductType={fetchProductType}
                            />,
                          ]}
                          rules={[{ required: true, message: '*เลือกรายการ' }]}>
                          <Select
                            placeholder="กดเพื่อเลือกรายการ"
                            value={'productType'}
                            dropdownStyle={{ fontFamily: 'Prompt' }}>
                            {typeData.map((item, index) => (
                              <Option key={index} value={item.typeId}>
                                {item.typeName}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mb-3">
                        <Form.Item
                          name="productUnit"
                          label="หน่วยของสินค้า"
                          rules={[
                            { required: true, message: '*ใส่หน่วยของสินค้า' },
                            { max: 10, message: '*ไม่เกิน 10 ตัวอักษร' },
                            { min: 2, message: '*ขั้นต่ำ 2 ตัวอักษร' },
                          ]}>
                          <Input placeholder="หน่วยของสินค้า" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col md={{ span: 3, offset: 6 }}>
                    <ButtonA onClick={() => history.back()}>ย้อนกลับ</ButtonA>
                  </Col>
                  <Col md={3}>
                    <ButtonA type="primary" htmlType="submit">
                      ยืนยัน
                    </ButtonA>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {needProcess && (
            <Col md={4}>
              <Card
                border="light"
                className="bg-white px-2 py-4"
                style={{
                  borderRadius: '36px',
                  boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  fontFamily: 'Prompt',
                  display: 'block',
                }}>
                <Card.Body>
                  <h5 className="mb-4">ข้อมูลการผสม / Recipe</h5>
                  <Row>
                    <Form.Item
                      name="recipeDescription"
                      label="คำอธิบายการผสม"
                      rules={[{ max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' }]}>
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="คำอธิบายการผสม"
                      />
                    </Form.Item>
                  </Row>
                  <Row className="mb-3 mt-3">
                    <Col xs={9} style={{ fontWeight: 'bold' }}>
                      ส่วนผสม
                    </Col>
                    <Col
                      xs={3}
                      style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      ปริมาณ
                    </Col>
                  </Row>
                  <Form.List name="RecipeItem" initialValue={[{}]}>
                    {(fields, { add, remove }, { error }) => {
                      return (
                        <>
                          {fields.map(({ key, name, ...restField }) => {
                            return (
                              <RowA
                                key={key}
                                style={{
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'row',
                                }}>
                                <Form.Item
                                  name={[name, 'ingrId']}
                                  {...restField}
                                  rules={[
                                    {
                                      required: true,
                                      message: '*เลือกรายการ',
                                    },
                                  ]}
                                  style={{ flex: 2, marginRight: 12 }}>
                                  <Select
                                    placeholder="กดเพื่อเลือกรายการ"
                                    dropdownStyle={{ fontFamily: 'Prompt' }}>
                                    {dataIngrStuff.map((item, index) => (
                                      <Option key={index} value={item.id}>
                                        {item.name} ({item.unit})
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  style={{ flex: 1 }}
                                  name={[name, 'amountRequired']}
                                  {...restField}
                                  rules={[
                                    { required: true, message: '*ใส่จำนวน' },
                                  ]}>
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
                                <a
                                  href=""
                                  onClick={e => {
                                    e.preventDefault();
                                    remove(name);
                                  }}>
                                  <IoIosTrash
                                    size={20}
                                    style={{
                                      marginTop: '10px',
                                      float: 'right',
                                    }}
                                  />
                                </a>
                              </RowA>
                            );
                          })}

                          <ButtonA
                            type="dashed"
                            onClick={() => {
                              add();
                            }}>
                            <PlusOutlined />
                          </ButtonA>
                        </>
                      );
                    }}
                  </Form.List>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};

export default ProductCreate;
