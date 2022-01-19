import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Form,
  Card,
  Breadcrumb,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import { List, Card as CardAnt } from 'antd';
import 'antd/dist/antd.min.css';
import { EditModal } from 'components/editform/EditModal';
import ProductService from 'services/product.service';
const App = props => {
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [openID, setOpenID] = useState();

  const [typeData, setTypeData] = useState([]);
  const search = value => {
    const filterTable = record.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setfilterData(filterTable);
  };
  const getFilter = value => {
    // eslint-disable-next-line eqeqeq
    var filterTable = record.filter(record => record.prod_type == value);
    setfilterData(filterTable);
  };

  const openRecord = id => {
    setOpenID(id);
    setModalShow(true);
  };
  const refreshList = () => {
    ProductService.getAll()
      .then(res => {
        setRecord(res.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    document.title = 'Admin Dashboard / สินค้าทั้งหมด';
    let mounted = true;
    // ProductService.getAll()
    //   .then(res => {
    //     if (mounted) {
    //       setRecord(res.data);
    //     }
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    // ProductService.getProductType()
    //   .then(res => {
    //     if (mounted) {
    //       var getData;
    //       getData = res.data;
    //       setTypeData(getData);
    //     }
    //   })
    //   .catch(error => {
    //     const resMessage =
    //       (error.response &&
    //         error.response.data &&
    //         error.response.data.message) ||
    //       error.message ||
    //       error.toString();
    //     alert(resMessage);
    //   });
    // return () => (mounted = false);
  }, []);
  const MyVerticallyCenteredModal = props => {
    return (
      <Modal {...props} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลสินค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditModal id={openID} />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  };
  const deleteRecord = id => {
    ProductService.remove(id)
      .then(response => {
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>

      <Card>
        <Card.Header>
          <div className="table-settings mb-4">
            <Row className="justify-content-between align-items-center">
              <Col xs={8} md={6} lg={3} xl={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search"
                    onChange={e => search(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4} className="mb-3">
                <InputGroup>
                  <Form.Select onChange={e => getFilter(e.target.value)}>
                    <option>Select a Product type</option>
                    {typeData.map(option => (
                      <option key={option.prod_type} value={option.prod_type}>
                        {option.category}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto">
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={filterData == null ? record : filterData}
            renderItem={item => (
              <List.Item>
                <CardAnt title={item.prod_name}>
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt=""
                    style={{
                      border: '1px solid #ddd',
                      'border-radius': '4px',
                      padding: '5px',
                      width: '100%',
                    }}
                    onClick={() => {
                      openRecord(item.prod_id);
                    }}
                  />
                  <div
                    style={{
                      'white-space': 'nowrap',
                      overflow: 'hidden',
                      'text-overflow': 'ellipsis',
                    }}>
                    {item.description}
                  </div>
                  <div>จำนวนสินค้าคงเหลือ {item.stock} ชิ้น</div>
                  <div>
                    <span
                      onClick={() => {
                        openRecord(item.prod_id);
                      }}>
                      <i className="fas fa-info-circle action mr-2"></i>
                    </span>
                    <span>&nbsp;&nbsp;</span>
                    <span
                      onClick={() => {
                        deleteRecord(item.prod_id);
                      }}>
                      <i className="fas fa-trash action"></i>
                    </span>
                  </div>
                </CardAnt>
              </List.Item>
            )}
          />
        </Card.Body>
      </Card>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
      />
    </>
  );
};
export default App;
