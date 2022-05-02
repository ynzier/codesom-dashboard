import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Col, Row, Card, Form, Modal, Alert } from 'react-bootstrap';
import { ListProductBranch } from 'components';
import { Button } from 'antd';
import Select from 'react-select';
import productService from 'services/product.service';
import branchesService from 'services/branches.service';

const ProductBranchModal = ({ editable, productId, needProcess }) => {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const [branchList, setBranchList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [edited, setEdited] = useState(false);
  const fetchPair = () => {
    productService
      .getAllPairByProductId(productId)
      .then(async res => {
        if (res.data.length > 0) {
          var tempData = [];
          await res.data.forEach(entry => {
            tempData.push({
              value: entry.branchId,
              label: entry.branch.branchName,
            });
          });
          setBranchList(tempData);
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
  const fetchBranch = () => {
    branchesService.getAllBranchName().then(async res => {
      if (res.data.length > 0) {
        var tempData = [];
        await res.data.forEach(entry => {
          tempData.push({
            value: entry.branchId,
            label: entry.branchName,
          });
        });
        setOptionList(tempData);
      }
    });
  };

  const branchSelectStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: editable ? 'white' : '#e8e8e8',
      borderRadius: 12,
      paddingBlock: 4,
      boxShadow: '0 0 0 1px #97515f',
      fontFamily: 'Prompt',
      borderColor: '#ffe9f1',
      ':hover': {
        borderColor: '#97515f',
      },
      ':focus': {
        borderColor: '#97515f',
      },
    }),
    option: (provided, state) => {
      return {
        ...provided,
        fontFamily: 'Prompt',
        color: state.isFocused || state.isSelected ? 'white' : '#a4a4a4',
        backgroundColor:
          state.isFocused || state.isSelected ? '#97515f' : 'white',
        ':active': { backgroundColor: '#c55474' },
      };
    },
    multiValue: styles => {
      return {
        ...styles,
        backgroundColor: 'rgba(196, 196, 196, 0.5)',
        borderRadius: 20,
        paddingLeft: 4,
        paddingRight: 2,
      };
    },
    multiValueLabel: styles => {
      return {
        ...styles,
        marginRight: 8,
        fontSize: 14,
        fontFamily: 'Prompt',
      };
    },
    multiValueRemove: styles => ({
      ...styles,
      ':hover': {
        color: 'white',
      },
    }),
  };
  const sendData = async () => {
    if (edited) {
      var preArray;
      if (branchList.length > 0) {
        preArray = branchList.map(item => {
          return {
            branchId: item.value,
          };
        });
        setBranchList(preArray);
      }
      await productService
        .updatePairProductBranch(productId, preArray)
        .then(response => {
          setEdited(false);
          fetchPair();
          alert.show(response.data.message, { type: 'success' });
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
    setShow(false);
  };

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <a
          href=""
          onClick={e => {
            e.preventDefault();
            setShow(true);
          }}>
          แสดงรายชื่อสาขา
        </a>
      </div>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onShow={async () => {
          console.log(branchList);
          await fetchPair();
          await fetchBranch();
        }}
        style={{ borderRadius: 40 }}
        onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อสาขาที่จำหน่าย</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5 mt-2 mb-4">
          {!needProcess && (
            <>
              <div
                className="mb-2"
                style={{
                  fontFamily: 'Prompt',
                  fontWeight: 600,
                }}>
                ยอดคงเหลือแต่ละสาขา
              </div>
              <ListProductBranch productId={productId} editable={editable} />
              <div
                className="mb-2"
                style={{
                  fontFamily: 'Prompt',
                  fontWeight: 600,
                }}>
                สาขาที่เลือก
              </div>
            </>
          )}
          <Select
            className="mb-2"
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            options={optionList}
            isDisabled={!editable}
            isClearable={false}
            styles={branchSelectStyle}
            value={branchList}
            minMenuHeight="500"
            noOptionsMessage={() => (
              <div style={{ fontFamily: 'Prompt' }}>ไม่พบสาขาอื่น</div>
            )}
            onChange={list => {
              setEdited(true);
              setBranchList(list);
            }}
            placeholder="ไม่มีสาขาที่เลือก"
          />
          {editable && (
            <Row className="mt-3">
              <Col md={{ span: 3, offset: 9 }}>
                <Button type="primary" onClick={sendData}>
                  ยืนยัน
                </Button>
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductBranchModal;
