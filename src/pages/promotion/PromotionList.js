import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import 'moment/locale/th';
import { List, Card as CardA, Image } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Form,
  Button,
  Card,
  Breadcrumb,
  InputGroup,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { Routes } from 'routes';
import ProductService from 'services/product.service';
import { RecipeLookUp } from 'components';
import promotionsService from 'services/promotions.service';

const { Meta } = CardA;

const PromotionList = () => {
  let history = useHistory();
  const { promiseInProgress } = usePromiseTracker();
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
            k != 'prImg' &&
            k != 'prType' &&
            k != 'product_type' &&
            k != 'prUnit'
          ) {
            return String(obj[k]).toLowerCase().includes(keyword.toLowerCase());
          }
        });
      // option
      if (keyword == '' && option != '') return obj.prType == option;
      // keyword option
      if (keyword != '' && option != '')
        return (
          obj.prType == option &&
          Object.keys(obj).some(k => {
            if (
              k != 'image' &&
              k != 'recipeId' &&
              k != 'prImg' &&
              k != 'prType' &&
              k != 'product_type' &&
              k != 'prUnit'
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

  const openRecord = prId => {
    history.push('/dashboard/product/getProduct/' + prId);
  };
  useEffect(async () => {
    document.title = 'รายการสินค้าทั้งหมด';
    let mounted = true;
    await trackPromise(
      new Promise((resolve, reject) => {
        resolve(
          promotionsService
            .getAllPromotion()
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
      }),
    );

    return () => (mounted = false);
  }, []);

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
            <Breadcrumb.Item active>สินค้าโปรโมชัน</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <Card
        border="light"
        className="bg-white px-6 py-4 mb-4"
        style={{
          borderRadius: '36px',
          boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
        }}>
        <Card.Header style={{ borderWidth: 0 }}>
          <div className="table-settings mb-3">
            <Row>
              <Col xs={8} md={6} lg={3} xl={4}>
                <h2>สินค้าโปรโมชัน</h2>
              </Col>
              <Col xs={5} xl={{ span: 2, offset: 6 }}>
                <Button
                  className="w-100"
                  as={Link}
                  to={Routes.AddPromotion.path}
                  variant="codesom"
                  style={{
                    color: '#fff',
                    height: '50px',
                    paddingTop: '0.75rem',
                    borderRadius: '10px',
                    boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                  }}>
                  เพิ่มโปรโมชัน
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Header>
        <Card.Body className="pt-0 w-100 mt-0 h-auto justify-content-center align-items-center">
          <List
            grid={{
              gutter: 16,
              column: 4,
            }}
            dataSource={record}
            loading={promiseInProgress}
            renderItem={item => (
              <List.Item key={item.promoId}>
                <CardA
                  loading={promiseInProgress}
                  hoverable
                  onClick={() => {
                    console.log('first');
                  }}
                  style={{ fontFamily: 'Prompt' }}
                  cover={
                    <Image
                      style={{
                        objectFit: 'contain',
                      }}
                      src={item.image?.imgObj ? item.image?.imgObj : 'error'}
                      fallback="data:image/png;base64,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"
                    />
                  }
                  actions={[
                    <div key="StartDate">
                      {moment(item.promoStart).locale('th').format('LL')}
                      <br />
                      {moment(item.promoEnd).locale('th').format('LL')}
                    </div>,
                  ]}>
                  <Meta title={item.promoName} description={item.promoDetail} />
                </CardA>
              </List.Item>
            )}
          />
        </Card.Body>
      </Card>
    </>
  );
};
export default PromotionList;
