import React, { useState, useEffect } from 'react';
import { AlertList } from 'react-bs-notifier';
import { Col, Row, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import BranchesService from 'services/branches.service';
import Select from 'react-select';

const ProductBranchSetting = ({ editable, generate, ...props }) => {
  const [show, setShow] = useState(false);
  const [brId, setBrId] = useState();
  const [authData, setAuthData] = useState();
  const [brName, setBrName] = useState('');
  const [brTel, setBrTel] = useState('');
  const [brUsername, setBrUsername] = useState('');
  const [brPassword, setBrPassword] = useState('');
  const [brConfirmPassword, setBrConfirmPassword] = useState('');
  const [accStatus, setAccStatus] = useState('');

  useEffect(async () => {
    if (props.brId) {
      await BranchesService.getBranchById(props.brId)
        .then(res => {
          if (res.data) {
            const getData = res.data;
            setBrName(getData.brName);
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
      await BranchesService.checkExistAcc(props.brId)
        .then(res => {
          if (res) {
            setAccStatus(res.data.status);
            setBrUsername('cs' + props.brId);
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
    }
    return () => {};
  }, [props.brId, accStatus]);

  const branchSelectStyle = {
    control: styles => ({
      ...styles,
      backgroundColor: editable ? 'white' : '#E8E8E8',
      borderRadius: 20,
    }),
    multiValue: styles => {
      return {
        ...styles,
        borderRadius: 20,
      };
    },
    multiValueLabel: styles => {
      return {
        ...styles,
        marginRight: 8,
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
          fontSize: 12,
          textAlign: 'right',
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
        <Modal.Body className="px-4 mt-3">
          <div>สาขาที่เลือก</div>
          <Select
            isMulti
            closeMenuOnSelect={false}
            options={options}
            defaultValue={[{ value: 'test', label: 'testest' }]}
            isDisabled={!editable}
            styles={branchSelectStyle}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductBranchSetting;
