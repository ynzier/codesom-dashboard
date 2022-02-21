import React, { useState } from 'react';
import { Col, Row, Card, Form, Button } from 'react-bootstrap';


// services
import BranchService from 'services/branches.service';

const BranchCreate = ({ generate }) => {
  const [brName, setBrName] = useState('');
  const [brAddr, setBrAddr] = useState('');
  const [tel, setTel] = useState('');
  const checkInput = e => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setTel(onlyDigits);
  };

  const handleSubmit = e => {
    e.preventDefault();
    sendData();
  };

  const sendData = async () => {
    var data = {
      brName: brName,
      brAddr: brAddr,
      brTel: tel, //on start
    };
    await BranchService.createNewBranch(data)
      .then(response => {
        setTel('');
        setBrName('');
        setBrAddr('');
        generate('success', response.data.message);
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
            <h2 className="mb-4">เพิ่มสาขา</h2>
            <Row>
              <Col>
                <Col md={12} xl={12} className="mb-3">
                  <Form.Group id="brName">
                    <Form.Label>ชื่อสาขา</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="ชื่อสาขา"
                      name="brName"
                      maxLength="40"
                      value={brName}
                      onChange={e => setBrName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Group id="tel">
                      <Form.Label>เบอร์โทรศัพท์</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        maxLength="10"
                        value={tel}
                        placeholder="เบอร์โทรศัพท์"
                        onChange={e => checkInput(e)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col md={12} xl={12} className="mb-3">
                    <Form.Group id="address">
                      <Form.Label>ที่อยู่</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        as="textarea"
                        rows={5}
                        placeholder="ที่อยู่"
                        name="brAddr"
                        value={brAddr}
                        maxLength="255"
                        onChange={e => setBrAddr(e.target.value)}
                        style={{ resize: 'none', paddingBottom: '4px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col sm={6} md={6} />
              <Col sm={3} md={3}>
                <div>
                  <Button
                    variant="tertiary"
                    type="submit"
                    style={{
                      borderRadius: '10px',
                      width: '100%',
                      height: '50px',
                      boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                      color: 'white',
                    }}>
                    บันทึกข้อมูล
                  </Button>
                </div>
              </Col>
              <Col sm={3} md={3}>
                <div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setBrName('');
                      setTel('');
                      setBrAddr('');
                    }}
                    style={{
                      borderRadius: '10px',
                      width: '100%',
                      height: '50px',
                      boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                      color: 'white',
                    }}>
                    ล้างข้อมูล
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};
export default BranchCreate;
