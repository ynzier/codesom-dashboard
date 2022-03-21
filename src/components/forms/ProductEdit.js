import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Card, Button } from 'react-bootstrap';
import ProductService from 'services/product.service';
import ingredientService from 'services/ingredient.service';
import FileService from 'services/file.service';
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
import { ManageProductType, ProductBranchModal } from 'components';
import { useAlert } from 'react-alert';

const ProductEdit = ({ prId }) => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const [editable, setEditable] = useState(false);
  const [dataIngrStuff, setDataIngrStuff] = useState([]);
  const [productData, setProductData] = useState({});
  const [typeData, setTypeData] = useState([]);
  const [needProcess, setNeedProcess] = useState(false);
  const [imgId, setImgId] = useState();
  const [base64TextString, setBase64TextString] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    document.title = 'ข้อมูลสินค้า';
    if (prId) {
      await fetchProductData(prId);
      await fetchProductType();
    }
    return () => {};
  }, [prId]);

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
    setEditable(false);
  };

  useEffect(() => {
    return () => {};
  }, []);

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
  const fetchProductData = async prId => {
    await ProductService.getProductById(prId)
      .then(res => {
        if (res.data) {
          var getData = res.data;
          if (!getData.needProcess) {
            setProductData({
              prName: getData.prName,
              prCost: getData.prCost,
              prPrice: getData.prPrice,
              prImg: getData.prImg,
              prType: getData.prType,
              prDetail: getData.prDetail,
              productStatus: getData.prStatus,
              needProcess: getData.needProcess,
            });
            setImgId(getData.prImg);
            setBase64TextString(getData.image.imgObj);
            setNeedProcess(getData.needProcess);
          } else if (getData.needProcess) {
            setProductData({
              prName: getData.prName,
              prCost: getData.prCost,
              prPrice: getData.prPrice,
              prImg: getData.prImg,
              prType: getData.prType,
              prDetail: getData.prDetail,
              prStatus: getData.prStatus,
              needProcess: getData.needProcess,
              recipeDescription: getData.recipe.description,
              RecipeItem: getData.recipe.recipe_ingredients,
            });
            setImgId(getData.prImg);
            setBase64TextString(getData.image.imgObj);
            setNeedProcess(getData.needProcess);
            fetchforRecipe();
          }
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
    var data = {
      prName: e.prName,
      prCost: e.prCost,
      prPrice: e.prPrice,
      prImg: imgId,
      prType: e.prType,
      prDetail: e.prDetail,
      prStatus: e.prStatus,
    };
    console.log(data);
    ProductService.updateProduct(prId, data)
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
        prName: e.prName,
        prCost: e.prCost,
        prPrice: e.prPrice,
        prImg: imgId,
        prType: e.prType,
        prDetail: e.prDetail,
        needProcess: needProcess,
      },
      recipeData: {
        description: e.recipeDescription,
        ingredients: e.RecipeItem,
      },
    };

    ProductService.updateProductWithRecipe(prId, data)
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
        name="addPromotion"
        preserve={false}
        layout="vertical"
        initialValues={productData}
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
                <h5 className="mb-4">ข้อมูลสินค้า / Goods Info</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Upload
                      name="productImg"
                      listType="picture-card"
                      className="avatar-uploader mb-4"
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
                    <Row>
                      <Form.Item
                        name="prDetail"
                        label="คำอธิบายของสินค้า"
                        rules={[
                          { max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' },
                        ]}>
                        <Input.TextArea
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          placeholder="คำอธิบายของสินค้า"
                          disabled={!editable}
                        />
                      </Form.Item>
                    </Row>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Row>
                      <Col className="mb-3">
                        <Form.Item
                          name="prName"
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
                      <Col md={6} className="mb-3">
                        <Form.Item
                          name="prCost"
                          label="ราคาทุน"
                          rules={[{ required: true, message: '*ใส่ราคา' }]}>
                          <InputNumber
                            min="0"
                            precision="2"
                            disabled={!editable}
                            stringMode
                            placeholder="0.00"
                          />
                        </Form.Item>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Item
                          name="prPrice"
                          label="ราคาขาย"
                          rules={[{ required: true, message: '*ใส่ราคา' }]}>
                          <InputNumber
                            min="0"
                            disabled={!editable}
                            precision="2"
                            stringMode
                            placeholder="0.00"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Item
                          name={'prType'}
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
                            value={'prType'}
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
                      <Col md={{ offset: 6, span: 6 }}>
                        <ProductBranchModal
                          editable={editable}
                          prId={prId}
                          needProcess={needProcess}
                        />
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
                      {editable ? (
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
                          ยืนยัน
                        </ButtonA>
                      ) : (
                        <Button
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
                          onClick={() => {
                            setEditable(true);
                          }}>
                          แก้ไข
                        </Button>
                      )}
                    </div>
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
                    {(fields, { add, remove }, { error }) => {
                      return (
                        <>
                          {fields.map((field, index) => {
                            return (
                              <RowA key={field.key} style={{ height: '100%' }}>
                                <ColA span={16}>
                                  <Form.Item
                                    name={[index, 'ingrId']}
                                    rules={[
                                      {
                                        required: true,
                                        message: '*เลือกรายการ',
                                      },
                                    ]}>
                                    <Select
                                      disabled={!editable}
                                      placeholder="กดเพื่อเลือกรายการ"
                                      value={[index, 'ingrId']}
                                      dropdownStyle={{ fontFamily: 'Prompt' }}>
                                      {dataIngrStuff.map((item, index) => (
                                        <Option key={index} value={item.id}>
                                          {item.name} ({item.unit})
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </ColA>
                                <ColA span={1} />
                                <ColA span={6} style={{ textAlign: 'center' }}>
                                  <Form.Item
                                    name={[index, 'amountRequired']}
                                    rules={[
                                      { required: true, message: 'ใส่จำนวน' },
                                    ]}>
                                    <InputNumber
                                      min="1"
                                      disabled={!editable}
                                      max="1000"
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
                                    onClick={() => remove(field.name)}
                                    size={20}
                                    className="dynamic-delete-button"
                                    style={{
                                      marginTop: '5px',
                                      float: 'right',
                                      display: editable ? 'block' : 'none',
                                    }}
                                  />
                                </ColA>
                              </RowA>
                            );
                          })}
                          {editable && (
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
                          )}
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
