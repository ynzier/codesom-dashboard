import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import Datetime from 'react-datetime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
  Modal,
  Alert,
} from 'react-bootstrap';

import ProductService from 'services/product.service';

var record = [];

var getData = [];

const RecordEdit = props => {
  const [modalShow, setModalShow] = useState(false);
  const [name, setName] = useState();
  const [tel, setTel] = useState();
  const [warrantyTime, setWarrantyTime] = useState();
  const [address, setAddress] = useState();
  const [serialID, setSerialID] = useState();
  const [invoiceID, setInvoiceID] = useState();
  const [modelID, setModelID] = useState();
  const [purchaseDate, setPurchaseDate] = useState();
  const [status, setStatus] = useState();
  const [comment, setComment] = useState();
  const [itemCount, setItemCount] = useState();
  const [massSerial, setMassSerial] = useState([]);
  const [modelData, setmodelData] = useState([]);

  useEffect(() => {
    ProductService.getAll()
      .then(res => {
        getData = res.data;
        setmodelData(getData);
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

    if (props.data) {
      record = props.data;
      setName(record.name);
      setModelID(record.modelID);
      setPurchaseDate(record.purchaseDate);
      setSerialID(record.serialID);
      setTel(record.tel);
      setWarrantyTime(record.warrantyTime);
      setInvoiceID(record.invoiceID);
      setStatus(record.status);
      setAddress(record.address);
      setComment(record.comment);
      setMassSerial(record.SerialArray);
      setItemCount(record.itemCount);
    }
  }, [props.data]);

  const MyVerticallyCenteredModal = props => {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>??????????????????????????????????????????????????????</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>???????????? - ?????????????????????: {record.name}</p>
          <p>?????????????????????????????????: {record.tel}</p>
          <p>?????????????????????: {record.address}</p>
          <p>?????????????????????????????????: {itemCount} ?????????</p>
          <p>??????????????????????????????: {modelID}</p>
          {massSerial ? (
            <>
              <p>????????????????????????: {record.serialID}</p>
            </>
          ) : (
            <p>??????????????????????????????: {record.serialID}</p>
          )}
          <p>??????????????????????????????: {moment(purchaseDate).format('DD/MM/YYYY')}</p>
          <p>???????????????????????????????????????????????????: {warrantyTime} ??????</p>
          <p>
            ???????????????????????????????????????????????????????????????????????????:{' '}
            {moment(purchaseDate).add(warrantyTime, 'y').format('DD/MM/YYYY')}
          </p>
          <p>??????????????????????????????: {record.invoiceID}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={updateCustomer}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    setModalShow(true);
  };

  const updateCustomer = () => {
    var data = {
      name: name,
      tel: tel,
      address: address,
      modelID: modelID,
      serialID: serialID,
      purchaseDate: moment(purchaseDate).format('DD/MM/YYYY'),
      warrantyTime: warrantyTime,
      expireDate: moment(purchaseDate)
        .add(warrantyTime, 'y')
        .format('DD/MM/YYYY'),
      invoiceID: invoiceID,
      comment: comment,
      itemCount: itemCount,
    };
    if (massSerial) {
      var SerialArray = massSerial.replace(/\n/g, ' ').split(' ');
      Object.assign(data, { SerialArray: SerialArray });
    }
    // CustomerDataService.update(props.data._id, data)
    //   .then(response => {
    //     setModalShow(false);
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        {record !== '' && (
          <Form onSubmit={handleSubmit}>
            <h5 className="my-4">???????????????????????????????????? / Customer Info</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="address">
                  <Form.Label>???????????? - ?????????????????????</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="????????????"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={10} className="mb-3">
                <Form.Group id="address">
                  <Form.Label>?????????????????????</Form.Label>
                  <Form.Control
                    required
                    as="textarea"
                    rows={3}
                    placeholder="?????????????????????????????????"
                    style={{ resize: 'none' }}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="phone">
                  <Form.Label>?????????????????????????????????</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="?????????????????????????????????"
                    value={tel}
                    onChange={e => setTel(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <h5 className="mb-4">???????????????????????????????????? / Goods Info</h5>
            {!massSerial[0] ? (
              <>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>??????????????????????????????</Form.Label>
                      <Form.Select
                        required
                        value={modelID}
                        onChange={e => setModelID(e.target.value)}>
                        <option>Select a ModelID</option>
                        {modelData.map(option => (
                          <option key={option._id} value={option.modelID}>
                            {option.modelID}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="ItemNo">
                      <Form.Label>?????????????????????????????? (Serial No.)</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="??????????????????????????????"
                        name="serialID"
                        value={serialID}
                        onChange={e => setSerialID(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col md={4} className="mb-3">
                    <Form.Group id="modelID">
                      <Form.Label>??????????????????????????????</Form.Label>
                      <Form.Select
                        required
                        value={modelID}
                        onChange={e => setModelID(e.target.value)}>
                        <option>Select a ModelID</option>
                        {modelData.map(option => (
                          <option key={option._id} value={option.modelID}>
                            {option.modelID}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="ItemNo">
                      <Form.Label>???????????????????????? (Lot No.)</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={serialID}
                        name="serialID"
                        onChange={e => setSerialID(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group id="ItemNo">
                      <Form.Label>
                        ??????????????????????????????????????????????????? (Serial No.)
                        <span style={{ color: 'red' }}>*??????????????????????????????????????????</span>
                      </Form.Label>
                      <Form.Control
                        required
                        type="text"
                        as="textarea"
                        rows={3}
                        value={massSerial.toString().split(',').join(' ')}
                        style={{ resize: 'none' }}
                        onChange={e => setMassSerial(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <Row className="align-items-center">
              <Col md={3} className="mb-3">
                <Form.Group id="birthday">
                  <Form.Label>??????????????????????????????</Form.Label>
                  <Datetime
                    timeFormat={false}
                    onChange={setPurchaseDate}
                    closeOnSelect={true}
                    renderInput={(props, openCalendar) => (
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </InputGroup.Text>
                        <Form.Control
                          required
                          type="text"
                          value={moment(purchaseDate, 'DD.MM.YYYY').format(
                            'DD/MM/YYYY',
                          )}
                          name="purchaseDate"
                          placeholder="?????????/???????????????/??????"
                          onFocus={openCalendar}
                          onChange={e => {
                            setPurchaseDate(
                              moment(e.target.value).format('DD/MM/YYYY'),
                            );
                          }}
                        />
                      </InputGroup>
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Group id="gender">
                  <Form.Label>??????????????????????????????????????????????????? (??????)</Form.Label>
                  <Form.Select
                    required
                    value={warrantyTime}
                    onChange={e => setWarrantyTime(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="mb-3">
                <Form.Group id="birthday">
                  <Form.Label>???????????????????????????????????????????????????????????????????????????</Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={{ backgroundColor: '#F5F8FB' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                    </InputGroup.Text>
                    <Form.Control
                      disabled
                      type="text"
                      placeholder="?????????/???????????????/??????"
                      value={moment(purchaseDate, 'DD.MM.YYYY')
                        .add(warrantyTime, 'y')
                        .format('DD/MM/YYYY')}
                      onChange={() => {}}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group id="ItemNo">
                  <Form.Label>?????????????????????????????? (Invoice No.)</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="??????????????????????????????"
                    name="invoiceID"
                    value={invoiceID}
                    onChange={e => setInvoiceID(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={10} className="mb-3">
                <Form.Group id="comment">
                  <Form.Label>????????????????????????</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-3">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
            {status === 1 ? (
              <Alert
                variant="success"
                style={{ marginTop: 20 }}
                onClose={() => setStatus(0)}
                dismissible>
                ??????????????????????????????????????????????????????????????????????????? !
              </Alert>
            ) : (
              ''
            )}
          </Form>
        )}

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
        />
      </Card.Body>
    </Card>
  );
};
export default RecordEdit;
