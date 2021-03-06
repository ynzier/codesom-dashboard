import React, { useState, useEffect } from 'react';
import { useAlert } from 'react-alert';
import { Form, Input, Button } from 'antd';
import { Col, Row, Modal } from 'react-bootstrap';
import BranchesService from 'services/branches.service';

const BranchAccDetail = ({ ...props }) => {
  const alert = useAlert();
  const [form] = Form.useForm();
  const [branchName, setBrName] = useState('');
  const [branchUsername, setbranchUsername] = useState('');
  const [accStatus, setAccStatus] = useState('');

  const refresh = async () => {
    await BranchesService.getBranchById(props.branchId)
      .then(res => {
        if (res.data) {
          const getData = res.data;
          setBrName(getData.branchName);
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
    await BranchesService.checkExistAcc(props.branchId)
      .then(res => {
        if (res) {
          setAccStatus(res.data.status);
          setbranchUsername('cs' + props.branchId);
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
  useEffect(async () => {
    if (props.branchId) {
      await BranchesService.getBranchById(props.branchId)
        .then(res => {
          if (res.data) {
            const getData = res.data;
            setBrName(getData.branchName);
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
      await BranchesService.checkExistAcc(props.branchId)
        .then(res => {
          if (res) {
            setAccStatus(res.data.status);
            setbranchUsername('cs' + props.branchId);
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
      form.resetFields();
    }
    return () => {};
  }, [props.branchId, accStatus]);

  const handleSubmit = e => {
    if (accStatus == 'valid') {
      sendData(e);
    }
    if (accStatus == 'existed') {
      sendUpdatePassword(e);
    }
  };
  const sendData = async e => {
    var data = {
      branchUsername: branchUsername,
      branchPassword: e.branchPassword,
      branchConfirmPassword: e.branchConfirmPassword,
    };
    await BranchesService.createBranchAcc(props.branchId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        refresh();
        props.setModalShow(false);
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
  const sendUpdatePassword = async e => {
    var data = {
      branchUsername: branchUsername,
      branchPassword: e.branchPassword,
      branchConfirmPassword: e.branchConfirmPassword,
    };
    await BranchesService.updateBrAcc(props.branchId, data)
      .then(response => {
        alert.show(response.data.message, { type: 'success' });
        refresh();
        props.setModalShow(false);
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
  return (
    <>
      <Modal {...props} onShow={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>???????????????????????????????????? App User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 mt-3">
          <Form
            name="settingForm"
            onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 12 }}>
            <Form.Item
              label="????????????????????????"
              name="branchName"
              initialValue={branchName}>
              <Input disabled={true} />
            </Form.Item>
            {accStatus == 'valid' && (
              <div>
                <p style={{ color: 'red' }}>
                  ????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????
                </p>
              </div>
            )}
            <Form.Item
              label="??????????????????????????????"
              name="branchUsername"
              initialValue={branchUsername}>
              <Input disabled />
            </Form.Item>

            {props.editable && (
              <Form.Item
                label="????????????????????????"
                name="branchPassword"
                rules={[
                  { required: true, message: '????????????????????????????????????!' },
                  { max: 16, message: '????????????????????? 16 ????????????????????????' },
                  { min: 8, message: '????????????????????????????????????????????????????????? 7 ????????????????????????' },
                ]}>
                <Input.Password />
              </Form.Item>
            )}
            {props.editable && (
              <Form.Item
                label="??????????????????????????????????????????"
                name="branchConfirmPassword"
                rules={[
                  { required: true, message: '????????????????????????????????????!' },
                  { max: 16, message: '????????????????????? 16 ????????????????????????' },
                  { min: 8, message: '????????????????????????????????????????????????????????? 7 ????????????????????????' },
                ]}>
                <Input.Password />
              </Form.Item>
            )}

            {accStatus == 'valid' && props.editable && (
              <>
                <div style={{ flex: 4 }} />
                <Form.Item wrapperCol={{ offset: 18, span: 6 }}>
                  <Button type="primary" htmlType="submit">
                    ??????????????????????????????
                  </Button>
                </Form.Item>
              </>
            )}
            {accStatus == 'existed' && props.editable && (
              <>
                <Form.Item wrapperCol={{ offset: 18, span: 6 }}>
                  <Button type="primary" htmlType="submit">
                    ????????????????????????????????????
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BranchAccDetail;
