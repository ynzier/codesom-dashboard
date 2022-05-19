import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Card } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import storageService from 'services/storage.service';

var getBranchData = [];
const ListProductBranch = ({ productId, editable }) => {
  const [record, setRecord] = useState([]);
  const alert = useAlert();
  const fetchData = () => {
    storageService
      .getAllBranchThatHaveProduct(productId)
      .then(res => {
        if (res.data.dataArray) {
          setRecord(res.data.dataArray);
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
  const deleteRecord = async branchId => {
    await storageService
      .removeList(productId, branchId)
      .then(res => {
        alert.show('ลบข้อมูลออกจากคลังสินค้าสำเร็จ!', { type: 'success' });
        if (record.length == 1) {
          setRecord([]);
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
    await fetchData();
  };

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    await storageService
      .getAllBranchThatHaveProduct(productId)
      .then(res => {
        if (mounted) {
          getBranchData = res.data.dataArray;
          setRecord(getBranchData);
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
    return () => (mounted = false);
  }, []);
  const columns = [
    {
      title: 'สาขา',
      dataIndex: 'branchId',
      width: 200,
      align: 'center',
      render: (text, record) => {
        return <span>{record.branch.branchName}</span>;
      },
    },
    {
      title: 'คงเหลือ',
      dataIndex: 'itemRemain',
      align: 'center',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <span>{text}</span>
            {editable && (
              <a
                onClick={() => {
                  deleteRecord(record.branch.branchId);
                }}>
                <FontAwesomeIcon
                  style={{ marginLeft: 4, color: '#C96480' }}
                  icon={faMinusCircle}
                />
              </a>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <Card className="px-0 py-1 mb-4" style={{ borderRadius: 10 }}>
      <Table
        columns={columns}
        dataSource={record}
        size="large"
        pagination={false}
        scroll={{ y: 240 }}
        style={{
          fontFamily: 'Prompt',
        }}
      />
    </Card>
  );
};

export default ListProductBranch;
