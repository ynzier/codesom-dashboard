import React, { useState, useEffect } from 'react';
import { AlertList } from 'react-bs-notifier';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import BranchesService from 'services/branches.service';
import Select from 'react-select';

const ProductBranchSetting = ({ editable, generate, ...props }) => {
  const [show, setShow] = useState(false);

  const branchSelectStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: editable ? 'white' : '#E8E8E8',
      borderRadius: 20,
      paddingBlock: 2,
      boxShadow: '0 0 0 1px #C96480',

      borderColor: '##e09fb2',
      ':hover': {
        borderColor: '#C96480',
      },
      ':focus': {
        borderColor: '#C96480',
      },
    }),
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
        color: '#696969',
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
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];
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
        onHide={() => setShow(false)}
        onShow={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>รายชื่อสาขา</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 mt-1">
          <div
            className="mb-2"
            style={{
              fontFamily: 'Prompt',
              fontWeight: 600,
            }}>
            สาขาที่เลือก
          </div>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={options}
            defaultValue={[{ value: 'test', label: 'testest' }]}
            isDisabled={!editable}
            styles={branchSelectStyle}
            minMenuHeight="500"
            noOptionsMessage={() => (
              <div style={{ fontFamily: 'Prompt' }}>ไม่พบสาขาอื่น</div>
            )}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductBranchSetting;
