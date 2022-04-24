import React, { useState, useEffect, useCallback } from 'react';
import { Col, Row, Card, Button, Stack } from 'react-bootstrap';
import FileService from 'services/file.service';
import storageService from 'services/storage.service';
import moment from 'moment-timezone';
import 'moment/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
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
  DatePicker,
  Switch,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useAlert } from 'react-alert';
import productService from 'services/product.service';
import promotionsService from 'services/promotions.service';
import TokenService from 'services/token.service';

const PromotionEdit = props => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [editable, setEditable] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const { promiseInProgress } = usePromiseTracker({});
  const [promoCost, setPromoCost] = useState(0);
  const [productData, setProductData] = useState([]);
  const [promoData, setPromoData] = useState({});
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const [loading, setLoading] = useState(false);
  const [isStore, setIsStore] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  useEffect(() => {
    fetchPromoData(props.promoId);
    fetchProducts();
  }, [props.promoId]);

  const fetchPromoData = async promoId => {
    await promotionsService
      .getPromotionById(promoId)
      .then(res => {
        if (res.data) {
          setPromoData(res.data);
          setPromoCost(res.data.promoCost);
          form.resetFields();
          setBase64TextString(res.data?.image?.imgObj);
          setIsDelivery(res.data.isDelivery);
          setIsStore(res.data.isStore);
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

  const handleFinish = async values => {
    var isDuplicate = false;
    if (values.productInPromotion) {
      const uniqueValues = new Set(
        values.productInPromotion.map(v => v.productId),
      );

      if (uniqueValues.size < values.productInPromotion.length) {
        isDuplicate = true;
      }
    }
    if (isDuplicate)
      return alert.show('ทำรายการไม่สำเร็จ เนื่องจากมีการใช้วัตถุดิบซ้ำกัน', {
        type: 'error',
      });

    var data = {
      promoName: values.promoName,
      promoDetail: values.promoDetail,
      promoStart: moment(values.promoDate[0]).startOf('day'),
      promoEnd: moment(values.promoDate[1]).endOf('day'),
      promoPrice: values.promoPrice.toString(),
      promoCost: promoCost,
      imgId: imgId,
      productInPromotion: values.productInPromotion,
      isDelivery: isDelivery,
      isStore: isStore,
    };
    promotionsService
      .updatePromotion(props.promoId, data)
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

  const fetchProducts = useCallback(() => {
    trackPromise(
      productService
        .getProductCreatePromo()
        .then(res => {
          setProductData(res.data);
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
    );
  });

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
    if (productData.length < 1) {
      fetchProducts();
    }
    const user = TokenService.getUser();
    if (user.authPayload.roleId == 2) setIsManager(true);
    return () => {};
  }, []);

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
            <Form
              form={form}
              name="addRecipeForm"
              preserve={false}
              initialValues={promoData}
              layout="vertical"
              onValuesChange={(_, value) => {
                if (value.productInPromotion) {
                  let sumCost = 0;
                  value.productInPromotion.forEach(e => {
                    if (e != undefined && e.productId && e.count) {
                      const price = productData.filter(
                        data => data.productId == e.productId,
                      );
                      sumCost = sumCost + price[0].productPrice * e.count;
                    }
                  });
                  setPromoCost(sumCost);
                }
              }}
              onFinish={values => {
                handleFinish(values);
              }}>
              <h5 className="mb-4">ข้อมูลโปรโมชัน</h5>
              <Row>
                <Col md={6}>
                  <Stack>
                    <Upload
                      name="productImg"
                      listType="picture-card"
                      className="avatar-uploader mb-1"
                      showUploadList={false}
                      disabled={!editable}
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
                    <Form.Item
                      name="promoDetail"
                      label="คำอธิบายโปรโมชัน"
                      rules={[{ max: 255, message: '*ห้ามเกิน 255 ตัวอักษร' }]}>
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder="คำอธิบายโปรโมชัน"
                        disabled={!editable}
                      />
                    </Form.Item>
                  </Stack>
                </Col>
                <Col md={6}>
                  <Stack>
                    <Form.Item
                      name="promoName"
                      label="ชื่อโปรโมชัน"
                      rules={[
                        { required: true, message: '*ใส่ชื่อโปรโมชัน' },
                        { max: 30, message: '*ไม่เกิน 30 ตัวอักษร' },
                      ]}>
                      <Input placeholder="ชื่อโปรโมชัน" disabled={!editable} />
                    </Form.Item>
                    <Form.Item
                      name="promoDate"
                      label="ระยะเวลาโปรโมชัน"
                      initialValue={[
                        moment(promoData.promoStart),
                        moment(promoData.promoEnd),
                      ]}
                      rules={[
                        { required: true, message: '*เลือกช่วงเวลาโปรโมชัน' },
                      ]}>
                      <RangePicker
                        locale={locale}
                        size="large"
                        disabled={!editable}
                        ranges={{
                          วันนี้: [
                            moment().startOf('day'),
                            moment().endOf('day'),
                          ],
                          เดือนนี้: [
                            moment().startOf('month'),
                            moment().endOf('month'),
                          ],
                        }}
                        popupStyle={{ fontFamily: 'Prompt' }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="promoPrice"
                      label="ราคาโปรโมชัน"
                      rules={[{ required: true, message: '*ใส่ราคา' }]}>
                      <InputNumber
                        min="0"
                        disabled={!editable}
                        precision="2"
                        stringMode
                        placeholder="0.00"
                      />
                    </Form.Item>
                  </Stack>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Switch
                    disabled={!editable}
                    style={{ marginRight: 8, marginTop: 0, width: 'auto' }}
                    size="default"
                    checked={isStore}
                    onChange={e => {
                      setIsStore(e);
                    }}
                  />
                  หน้าร้าน
                  <Switch
                    disabled={!editable}
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                      marginTop: 0,
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
              </Row>
              <Row className="mb-3 mt-3">
                <Col xs={8} style={{ fontWeight: 'bold' }}>
                  สินค้าที่ร่วมรายการ
                </Col>
                <Col xs={4} style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  จำนวน
                </Col>
              </Row>

              <Form.List
                name="productInPromotion"
                initialValue={promoData.promotion_items}>
                {(fields, { add, remove }, { error }) => {
                  return (
                    <>
                      {fields.map((field, index) => {
                        return (
                          <RowA key={field.key} style={{ height: '100%' }}>
                            <ColA span={16}>
                              <Form.Item
                                name={[index, 'productId']}
                                rules={[
                                  { required: true, message: '*เลือกรายการ' },
                                ]}>
                                <Select
                                  placeholder="กดเพื่อเลือกรายการ"
                                  disabled={!editable}
                                  value={[index, 'productId']}
                                  dropdownStyle={{ fontFamily: 'Prompt' }}>
                                  {productData.map((item, index) => (
                                    <Option key={index} value={item.productId}>
                                      {item.productName} ({item.productId})
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </ColA>
                            <ColA span={1} />
                            <ColA span={6} style={{ textAlign: 'center' }}>
                              <Form.Item
                                name={[index, 'count']}
                                rules={[
                                  { required: true, message: 'ใส่จำนวน' },
                                ]}>
                                <InputNumber
                                  min="1"
                                  max="1000"
                                  disabled={!editable}
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
                            display: editable ? 'block' : 'none',
                          }}>
                          <PlusOutlined />
                        </Button>
                      </RowA>
                    </>
                  );
                }}
              </Form.List>
              <RowA style={{ justifyContent: 'flex-end' }} className="mb-3">
                <Col md={4}>
                  <div style={{ fontWeight: 600 }}>ราคาปกติ</div>
                  <InputNumber
                    min="0"
                    precision="2"
                    stringMode
                    disabled
                    placeholder="0.00"
                    value={promoCost}
                  />
                </Col>
              </RowA>
              {!isManager && (
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
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default PromotionEdit;
