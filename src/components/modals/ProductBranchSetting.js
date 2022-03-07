import React, { useState, useEffect } from 'react';
import { AlertList } from 'react-bs-notifier';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import productService from 'services/product.service';
import branchesService from 'services/branches.service';

const ProductBranchSetting = ({ editable, prId, generate, ...props }) => {
  const [show, setShow] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [optionList, setOptionList] = useState([]);
  useEffect(async () => {
    if (prId) {
      await productService
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
          generate('danger', resMessage);
        });
      await branchesService.getAllBranchName().then(async res => {
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
    }
    return () => {};
  }, [prId]);

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
    if (branchList.length) {
      var preArray;
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
      <a
        style={{
          fontFamily: 'Prompt',
          color: '#c4c4c4',
          fontSize: 14,
          textDecoration: 'underline',
        }}
        onClick={() => setShow(true)}>
        แสดงรายชื่อสาขา
      </a>
      <Modal
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อสาขาที่จำหน่าย</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 mt-1 mb-2">
          <div
            className="mb-2"
            style={{
              fontFamily: 'Prompt',
              fontWeight: 600,
            }}>
            สาขาที่เลือก
          </div>
          <Select
            className="mb-2"
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            options={optionList}
            isDisabled={!editable}
            isClearable={false}
            styles={branchSelectStyle}
            defaultValue={branchList}
            minMenuHeight="500"
            noOptionsMessage={() => (
              <div style={{ fontFamily: 'Prompt' }}>ไม่พบสาขาอื่น</div>
            )}
            onChange={list => {
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

export default ProductBranchSetting;
