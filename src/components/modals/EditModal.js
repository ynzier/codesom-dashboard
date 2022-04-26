import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Form, Button, Alert } from 'react-bootstrap';
import ProductService from 'services/product.service';

var getData = [];
var getDataAlt = [];
const EditModal = props => {
  const [prodID, setProdID] = useState();
  const [productName, setProdName] = useState('');
  const [productPrice, setProductPrice] = useState();
  const [itemCount, setItemCount] = useState(1);
  const [productType, setProductType] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [base64TextString, setBase64TextString] = useState();

  const [errorMessage, setErrorMessage] = useState('');
  const [fileerrorMessage, setFileErrorMessage] = useState('');
  const [typeData, setTypeData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [status, setStatus] = useState(0);
  const blockInvalidChar = e =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const handleFileChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size <= 3 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = _handleReaderLoaded;
        reader.readAsBinaryString(file);
        setFileErrorMessage('');
      } else {
        setFileErrorMessage('ไฟล์จะต้องมีขนาดไม่เกิน 3 MB');
        setBase64TextString();
      }
    }
  };
  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result;
    setBase64TextString(btoa(binaryString));
  };

  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
    let mounted = true;
    ProductService.getProductType()
      .then(res => {
        if (mounted) {
          getData = res.data;
          setTypeData(getData);
          setErrorMessage('');
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
    ProductService.getBrand()
      .then(res => {
        if (mounted) {
          getDataAlt = res.data;
          setBrandData(getDataAlt);
          setErrorMessage('');
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
    ProductService.getOne(props.id)
      .then(res => {
        console.log(res.data);
        setProdID(res.data.prod_id);
        setProdName(res.data.productName);
        setProductPrice(res.data.price);
        setItemCount(res.data.stock);
        setProductType(res.data.prod_type);
        setProductBrand(res.data.brand_id);
        setProdDescription(res.data.description);
        setBase64TextString(res.data.image);
      })
      .catch(e => {
        console.log(e);
      });
    return () => (mounted = false);
  }, [props.id]);

  const form = document.forms[0];

  const handleSubmit = e => {
    updateData();
    e.preventDefault();
  };

  const updateData = () => {
    var data = {
      productName: productName,
      price: productPrice,
      prod_type: productType,
      stock: itemCount,
      image: base64TextString,
      description: prodDescription,
      brand_id: productBrand,
    };
    ProductService.update(prodID, data)
      .then(response => {
        console.log('ok');
        setStatus(1);
        form.reset();
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

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <h5 className="mb-4">ข้อมูลสินค้า / Goods Info</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="ItemNo">
                <Form.Label>ชื่อสินค้า</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="ชื่อสินค้า"
                  name="productName"
                  defaultValue={productName}
                  onChange={e => setProdName(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>ราคา</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={productPrice}
                  onKeyDown={blockInvalidChar}
                  onChange={e => setProductPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>จำนวนสินค้า</Form.Label>
                <Form.Control
                  required
                  type="number"
                  name="itemCount"
                  onKeyDown={blockInvalidChar}
                  defaultValue={itemCount}
                  onChange={e => setItemCount(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>ชนิดสินค้า</Form.Label>
                <Form.Select
                  required
                  onChange={e => setProductType(e.target.value)}
                  defaultValue={productType}>
                  {typeData.map(option => (
                    <option key={option.prod_type} value={option.prod_type}>
                      {option.category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>แบรนด์</Form.Label>
                <Form.Select
                  required
                  onChange={e => setProductBrand(e.target.value)}
                  defaultValue={productBrand}>
                  {brandData.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={10} className="mb-3">
              <Form.Group id="address">
                <Form.Label>คำอธิบาย</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="คำอธิบายเกี่ยวกับสินค้า"
                  style={{ resize: 'none' }}
                  name="description"
                  defaultValue={prodDescription}
                  onChange={e => setProdDescription(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>รูปสินค้า</Form.Label>
                <Form.Control
                  type="file"
                  size="35"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <img
                src={`data:image/jpeg;base64,${base64TextString}`}
                alt=""
                style={{
                  display: 'block',
                  'margin-left': 'auto',
                  'margin-right': 'auto',
                  width: '50%',
                }}
              />
              {fileerrorMessage && (
                <Alert variant="danger">{fileerrorMessage}</Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <div>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ height: 55, width: '100%' }}>
                  Update
                </Button>
              </div>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            </Col>
            <Col md={5}>
              {status === 1 ? (
                <Alert
                  variant="success"
                  onClose={() => setStatus(0)}
                  dismissible>
                  บันทึกข้อมูลเรียบร้อยแล้ว !
                </Alert>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditModal;
