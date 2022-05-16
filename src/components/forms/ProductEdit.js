import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import ProductService from 'services/product.service';
import ingredientService from 'services/ingredient.service';
import FileService from 'services/file.service';
import { IoIosTrash } from 'react-icons/io';
import {
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
import { ManageProductType, ProductBranchModal } from 'components';
import { useAlert } from 'react-alert';

const ProductEdit = ({ productId }) => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [editable, setEditable] = useState(false);
  const [dataIngrStuff, setDataIngrStuff] = useState([]);
  const [productData, setProductData] = useState({});
  const [productCost, setPrCost] = useState(0);
  const [typeData, setTypeData] = useState([]);
  const [needProcess, setNeedProcess] = useState(false);
  const [imgId, setImgId] = useState();
  const [base64TextString, setBase64TextString] = useState();
  const [isDelivery, setIsDelivery] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (productId) {
      await fetchProductData(productId);
      await fetchProductType();
    }
    return () => {};
  }, [productId]);

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

  const fetchforRecipe = useCallback(() => {
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
      });
  });
  const fetchProductData = async productId => {
    await ProductService.getProductById(productId)
      .then(res => {
        if (res.data) {
          var getData = res.data;
          setIsDelivery(getData.isDelivery);
          if (!getData.needProcess) {
            setProductData({
              productName: getData.productName,
              productCost: getData.productCost,
              productPrice: getData.productPrice,
              productImg: getData.productImg,
              productUnit: getData.productUnit,
              productType: getData.productType,
              productDetail: getData.productDetail,
              productStatus: getData.productStatus,
              weight: getData.weight,
            });
            if (getData.productImg) {
              setImgId(getData.productImg);
              setBase64TextString(getData.image?.imgObj);
            }
            form.resetFields();
            setNeedProcess(getData.needProcess);
          } else if (getData.needProcess) {
            setProductData({
              productName: getData.productName,
              productCost: getData.productCost,
              productPrice: getData.productPrice,
              productImg: getData.productImg,
              productType: getData.productType,
              productUnit: getData.productUnit,
              productDetail: getData.productDetail,
              productStatus: getData.productStatus,
              needProcess: getData.needProcess,
              weight: getData.weight,
              recipeDescription: getData.recipe.description,
            });
            form.resetFields();
            form.setFieldsValue({
              RecipeItem: getData.recipe.recipe_ingredients,
            });
            if (getData.productImg) {
              setImgId(getData.productImg);
              setBase64TextString(getData.image?.imgObj);
            }
            setPrCost(getData.productCost);
            setNeedProcess(getData.needProcess);
            fetchforRecipe();
          }
          if (getData.isDelivery)
            form.setFieldsValue({ weight: getData.weight });
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
        alert.show(resMessage, { type: 'error' });
      });
  };
  const sendData = e => {
    if (Number(e.weight) < 1)
      return alert.show('กรุณาใส่น้ำหนักก่อน', { type: 'error' });
    var data = {
      productName: e.productName,
      productCost: e.productCost,
      productPrice: e.productPrice,
      productImg: imgId,
      productType: e.productType,
      productUnit: e.productUnit,
      productDetail: e.productDetail,
      productStatus: e.productStatus,
      weight: e.weight,
      isDelivery: isDelivery,
    };
    ProductService.updateProduct(productId, data)
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
    if (Number(e.weight) < 1)
      return alert.show('กรุณาใส่น้ำหนักก่อน', { type: 'error' });

    var data = {
      productData: {
        productName: e.productName,
        productCost: productCost,
        productPrice: e.productPrice,
        productImg: imgId,
        productType: e.productType,
        productUnit: e.productUnit,
        productDetail: e.productDetail,
        weight: e.weight,
        needProcess: needProcess,
        isDelivery: isDelivery,
      },
      recipeData: {
        description: e.recipeDescription,
        ingredients: e.RecipeItem,
      },
    };

    ProductService.updateProductWithRecipe(productId, data)
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

          alert.show(resMessage, { type: 'error' });
        });
    }
  }, [base64TextString]);
  return (
    <>
      <Form
        form={form}
        name="editProduct"
        preserve={false}
        layout="vertical"
        initialValues={productData}
        onValuesChange={(_, value) => {
          if (value.RecipeItem) {
            let sumCost = 0;
            value.RecipeItem.forEach(e => {
              if (e != undefined && e.ingrId && e.amountRequired) {
                const price = dataIngrStuff.filter(data => data.id == e.ingrId);
                sumCost = sumCost + price[0].cost * e.amountRequired;
              }
            });
            setPrCost(sumCost);
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
                <h5 className="mb-4">ข้อมูลสินค้า</h5>
                <Row>
                  <Col md={6}>
                    <Upload
                      name="productImg"
                      listType="picture-card"
                      className="avatar-uploader mb-1"
                      showUploadList={false}
                      customRequest={() => {}}
                      disabled={!editable}
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

                    <Form.Item
                      name="productDetail"
                      label="คำอธิบายของสินค้า"
                      rules={[{ max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' }]}>
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="คำอธิบายของสินค้า"
                        disabled={!editable}
                      />
                    </Form.Item>
                    <Row>
                      <Col>
                        <Switch
                          disabled={!editable}
                          style={{
                            marginRight: 8,
                            marginTop: 4,
                            width: 'auto',
                          }}
                          size="default"
                          checked={isDelivery}
                          onChange={e => {
                            setIsDelivery(e);
                          }}
                        />
                        เดลิเวอรี
                      </Col>
                      {isDelivery == 1 && (
                        <Col>
                          <Form.Item
                            name="weight"
                            label="น้ำหนัก (กรัม)"
                            rules={[
                              { required: true, message: '*ใส่น้ำหนัก' },
                            ]}>
                            <InputNumber
                              min="1"
                              defaultValue="1"
                              style={{ width: '100%' }}
                              max="10000"
                              disabled={!editable}
                            />
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Row>
                      <Col>
                        <Form.Item
                          name="productName"
                          label="ชื่อสินค้า"
                          rules={[
                            { required: true, message: '*ใส่ชื่อสินค้า' },
                            { max: 30, message: '*ไม่เกิน 30 ตัวอักษร' },
                          ]}>
                          <Input
                            placeholder="ชื่อสินค้า"
                            disabled={!editable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        {needProcess ? (
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 9 }}>
                              ราคาทุน
                            </div>
                            <InputNumber
                              min="0"
                              precision="2"
                              max="10000"
                              stringMode
                              style={{ width: '100%' }}
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
                              max="10000"
                              stringMode
                              disabled={!editable}
                              placeholder="0.00"
                            />
                          </Form.Item>
                        )}
                      </Col>
                      <Col md={6}>
                        <Form.Item
                          name="productPrice"
                          label="ราคาขาย"
                          rules={[{ required: true, message: '*ใส่ราคา' }]}>
                          <InputNumber
                            min="0"
                            style={{ width: '100%' }}
                            max="10000"
                            disabled={!editable}
                            precision="2"
                            stringMode
                            placeholder="0.00"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
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
                            disabled={!editable}
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
                          <Input
                            placeholder="หน่วยของสินค้า"
                            disabled={!editable}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={{ offset: 6, span: 6 }}>
                        <ProductBranchModal
                          editable={editable}
                          productId={productId}
                          needProcess={needProcess}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col md={{ span: 3, offset: 6 }}>
                    <div>
                      <ButtonA onClick={() => history.back()}>ย้อนกลับ</ButtonA>
                    </div>
                  </Col>
                  <Col md={3}>
                    {editable && (
                      <ButtonA type="primary" htmlType="submit">
                        ยืนยัน
                      </ButtonA>
                    )}
                    {!editable && (
                      <ButtonA
                        type="primary"
                        htmlType="button"
                        onClick={() => {
                          setEditable(true);
                        }}>
                        แก้ไข
                      </ButtonA>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          {needProcess == 1 && (
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
                        disabled={!editable}
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
                  <Form.List name="RecipeItem">
                    {(fields, { add, remove }) => {
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
                                    disabled={!editable}
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
                                    disabled={!editable}
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
                                      display: editable ? 'block' : 'none',
                                    }}
                                  />
                                </a>
                              </RowA>
                            );
                          })}
                          <RowA style={{ justifyContent: 'center' }}>
                            <ButtonA
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              disabled={!editable}>
                              <PlusOutlined />
                            </ButtonA>
                          </RowA>
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

export default ProductEdit;
