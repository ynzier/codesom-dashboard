import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NumberFormat from 'react-number-format';
import { Table } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Card, Breadcrumb, InputGroup } from 'react-bootstrap';
import { Image, Button, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { Routes } from 'routes';
import ProductService from 'services/product.service';
import { RecipeLookUp } from 'components';
const { Option } = Select;

const ProductList = props => {
  let history = useHistory();
  let location = useLocation();
  const { selectBranch } = props;
  const { promiseInProgress } = usePromiseTracker({
    area: ProductService.area.productList,
  });
  const alert = useAlert();

  const [showRecipe, setShowRecipe] = useState(false);
  const [recipeId, setRecipeId] = useState();
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [option, setOption] = useState('');

  useEffect(async () => {
    const filterTable = record.filter(obj => {
      // keyword
      if (keyword != '' && option == '')
        return Object.keys(obj).some(k => {
          if (
            k != 'image' &&
            k != 'recipeId' &&
            k != 'productImg' &&
            k != 'productType' &&
            k != 'product_type' &&
            k != 'productUnit'
          ) {
            return String(obj[k]).toLowerCase().includes(keyword.toLowerCase());
          }
        });
      // option
      if (keyword == '' && option != '') return obj.productType == option;
      // keyword option
      if (keyword != '' && option != '')
        return (
          obj.productType == option &&
          Object.keys(obj).some(k => {
            if (
              k != 'image' &&
              k != 'recipeId' &&
              k != 'productImg' &&
              k != 'productType' &&
              k != 'product_type' &&
              k != 'productUnit'
            ) {
              return String(obj[k])
                .toLowerCase()
                .includes(keyword.toLowerCase());
            }
          })
        );
    });
    setfilterData(filterTable);
    return () => {};
  }, [keyword, option]);

  const openRecord = productId => {
    history.push('/dashboard/product/getProduct/' + productId);
  };

  useEffect(async () => {
    document.title = 'สินค้า';
    let mounted = true;
    await trackPromise(
      new Promise((resolve, reject) => {
        if (!location.state?.isManager)
          resolve(
            ProductService.getAllProducts()
              .then(res => {
                if (mounted) {
                  setRecord(res.data);
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
              }),
          );
        resolve(
          ProductService.getAllProductTypes()
            .then(res => {
              if (mounted) {
                var getData;
                getData = res.data;
                setTypeData(getData);
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
            }),
        );
      }),
      ProductService.area.productList,
    );

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (selectBranch != null)
      ProductService.getManagerAllProductInBranch(selectBranch)
        .then(res => setRecord(res.data))
        .catch(error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          alert.show(resMessage, { type: 'error' });
        });

    return () => {};
  }, [selectBranch]);

  const header = [
    {
      title: 'รูป',
      dataIndex: 'image',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <Image
            alt={record.productDetail}
            width="100%"
            height={140}
            style={{ objectFit: 'cover' }}
            src={record?.image?.imgObj ? record?.image?.imgObj : 'error'}
            fallback="data:image/png;base64,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"
          />
        );
      },
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <>
            <div
              style={{
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              {record.productName}
            </div>
            <div style={{ textAlign: 'left', fontSize: '12px' }}>
              {record.productDetail}
            </div>
            {record.needProcess == 1 && (
              <div style={{ textAlign: 'left' }}>
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    setShowRecipe(true);
                    setRecipeId(record.productId);
                  }}>
                  ดูส่วนผสม
                </a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productId',
      align: 'center',
      width: 200,
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'product_type',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return <div>{record.product_type.typeName}</div>;
      },
    },
    {
      title: 'ราคา',
      dataIndex: 'productPrice',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <NumberFormat
            value={record.productPrice}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
          />
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'productStatus',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>{record.productStatus}</div>;
      },
    },
    {
      key: 'key',
      dataIndex: 'key',
      title: 'Action',
      align: 'center',
      render: (text, record) => {
        return (
          <a
            href=""
            onClick={e => {
              e.preventDefault();
              const productId = record.productId;
              openRecord(productId);
            }}>
            <FiEdit size={18} />
          </a>
        );
      },
    },
  ];

  const headerManager = [
    {
      title: 'รูป',
      dataIndex: 'image',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <Image
            alt={record.productDetail}
            width="100%"
            height={140}
            style={{ objectFit: 'cover' }}
            src={record?.image?.imgObj ? record?.image?.imgObj : 'error'}
            fallback="data:image/png;base64,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"
          />
        );
      },
    },
    {
      title: 'ชื่อสินค้า',
      dataIndex: 'productName',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return (
          <>
            <div
              style={{
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 'bold',
              }}>
              {record.productName}
            </div>
            <div style={{ textAlign: 'left', fontSize: '12px' }}>
              {record.productDetail}
            </div>
            {record.needProcess == 1 && (
              <div style={{ textAlign: 'left' }}>
                <a
                  href=""
                  onClick={e => {
                    e.preventDefault();
                    setShowRecipe(true);
                    setRecipeId(record.productId);
                  }}>
                  ดูส่วนผสม
                </a>
              </div>
            )}
          </>
        );
      },
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'productId',
      align: 'center',
      width: 200,
    },
    {
      title: 'ประเภทสินค้า',
      dataIndex: 'product_type',
      align: 'center',
      width: 300,
      render: (text, record) => {
        return <div>{record.product_type.typeName}</div>;
      },
    },
    {
      title: 'ราคา',
      dataIndex: 'productPrice',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return (
          <NumberFormat
            value={record.productPrice}
            decimalScale={2}
            fixedDecimalScale={true}
            decimalSeparator="."
            displayType={'text'}
            thousandSeparator={true}
          />
        );
      },
    },
    {
      title: 'สถานะ',
      dataIndex: 'productStatus',
      align: 'center',
      width: 200,
      render: (text, record) => {
        return <div>{record.productStatus}</div>;
      },
    },
  ];
  return (
    <>
      <RecipeLookUp
        recipeId={recipeId}
        showRecipe={showRecipe}
        setShowRecipe={setShowRecipe}
      />
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4 mt-2">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb
            className="d-none d-md-inline-block"
            listProps={{ className: 'breadcrumb-dark breadcrumb-transparent' }}>
            <Breadcrumb.Item>
              <Link to={Routes.Home.path}>
                <FontAwesomeIcon icon={faHome} />
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item active>สินค้า</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
          fontFamily: 'Prompt',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings mb-1">
            <Row>
              <Col xs={8} md={6} lg={3} xl={4}>
                <Input
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="ค้นหาชื่อสินค้า"
                />
              </Col>
              <Col xs={4} md={4} xl={3}>
                <Select
                  className="mb-3"
                  showSearch
                  style={{
                    width: 300,
                    fontFamily: 'Prompt',
                  }}
                  placeholder="ชนิดสินค้า"
                  optionFilterProp="children"
                  dropdownStyle={{ fontFamily: 'Prompt' }}
                  onChange={value => {
                    setOption(value);
                  }}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }>
                  {typeData.map(option => (
                    <Option key={option.typeId} value={option.typeId}>
                      {option.typeName}
                    </Option>
                  ))}
                </Select>
              </Col>
              {!location.state?.isManager && (
                <Col xs={5} xl={{ span: 2, offset: 3 }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      history.push(Routes.AddProduct.path);
                    }}>
                    เพิ่มสินค้าใหม่
                  </Button>
                </Col>
              )}
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <Table
            dataSource={keyword != '' || option != '' ? filterData : record}
            columns={location.state?.isManager ? headerManager : header}
            loading={promiseInProgress}
            rowKey="productId"
            pagination={{ pageSize: 20, showSizeChanger: false }}
            style={{
              fontFamily: 'Prompt',
            }}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default ProductList;
