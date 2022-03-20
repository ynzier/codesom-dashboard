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
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useAlert } from 'react-alert';
import productService from 'services/product.service';
import promotionsService from 'services/promotions.service';

const PromotionEdit = props => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { promiseInProgress } = usePromiseTracker({});
  const [pushProduct, setPushProduct] = useState([]);
  const [productData, setProductData] = useState([]);
  const [promoData, setPromoData] = useState({});
  const [base64TextString, setBase64TextString] = useState();
  const [imgId, setImgId] = useState();
  const [loading, setLoading] = useState(false);
  const [promoName, setPromoName] = useState('');
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
          form.resetFields();

          setBase64TextString(res.data?.image?.imgObj);
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
        values.productInPromotion.map(v => v.ingrId),
      );

      if (uniqueValues.size < values.productInPromotion.length) {
        isDuplicate = true;
      }
    }
    if (!isDuplicate) setPushProduct(values.productInPromotion);
    if (isDuplicate)
      return alert.show('ทำรายการไม่สำเร็จ เนื่องจากมีการใช้วัตถุดิบซ้ำกัน', {
        type: 'error',
      });

    var data = {
      promoName: values.promoName,
      promoDetail: values.promoDetail,
      promoStart: values.promoDate[0],
      promoEnd: values.promoDate[1],
      promoPrice: values.promoPrice,
      imgId: imgId,
      productInPromotion: values.productInPromotion,
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
                      />
                    </Form.Item>
                  </Stack>
                </Col>
                <Col md={6}>
                  <Stack>
                    <Form.Item
                      name="promoName"
                      label="ชื่อโปรโมชัน"
                      rules={[{ required: true, message: '*ใส่ชื่อโปรโมชัน' }]}>
                      <Input placeholder="ชื่อโปรโมชัน" />
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
                        precision="2"
                        stringMode
                        placeholder="0.00"
                      />
                    </Form.Item>
                  </Stack>
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
                                  value={[index, 'productId']}
                                  dropdownStyle={{ fontFamily: 'Prompt' }}>
                                  {productData.map((item, index) => (
                                    <Option key={index} value={item.prId}>
                                      {item.prName} ({item.prId})
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
                    </>
                  );
                }}
              </Form.List>
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
                  <ButtonA
                    style={{
                      width: '100%',
                      height: '100%',
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
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default PromotionEdit;
