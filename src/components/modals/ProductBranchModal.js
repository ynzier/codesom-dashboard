import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import { ListProductBranch } from 'components';
import Select from 'react-select';
import productService from 'services/product.service';
import branchesService from 'services/branches.service';

const ProductBranchModal = ({ editable, prId, needProcess }) => {
  const [show, setShow] = useState(false);
  const alert = useAlert();
  const [branchList, setBranchList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [edited, setEdited] = useState(false);
  const fetchPair = () => {
    productService
      .getAllPairByProductId(prId)
      .then(async res => {
        if (res.data.length > 0) {
          var tempData = [];
          await res.data.forEach(entry => {
            tempData.push({
              value: entry.branchId,
              label: entry.branch.brName,
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
            value: entry.brId,
            label: entry.brName,
          });
        });
        setOptionList(tempData);
      }
    });
  };

  const branchSelectStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: editable ? 'white' : '#E8E8E8',
      borderRadius: 20,
      paddingBlock: 4,
      boxShadow: '0 0 0 1px #ffe9f1',
      fontFamily: 'Prompt',
      borderColor: '#ffe9f1',
      ':hover': {
        borderColor: '#C96480',
      },
      ':focus': {
        borderColor: '#C96480',
      },
    }),
    option: (provided, state) => {
      return {
        ...provided,
        fontFamily: 'Prompt',
        color: state.isFocused || state.isSelected ? 'white' : '#a4a4a4',
        backgroundColor:
          state.isFocused || state.isSelected ? '#C96480' : 'white',
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
        .updatePairProductBranch(prId, preArray)
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
      <a
        style={{
          fontFamily: 'Prompt',
          color: '#c4c4c4',
          fontSize: 14,
          textDecoration: 'underline',
          textAlign: 'right',
          float: 'right',
        }}
        onClick={() => setShow(true)}>
        แสดงรายชื่อสาขา
      </a>
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
              <ListProductBranch prId={prId} editable={editable} />
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
                <Button
                  className="px-4 py-2"
                  variant="tertiary"
                  style={{ color: 'white' }}
                  onClick={sendData}>
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
