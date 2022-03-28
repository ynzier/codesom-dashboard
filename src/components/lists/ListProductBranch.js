import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Card } from 'react-bootstrap';
import { useAlert } from 'react-alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import storageService from 'services/storage.service';

var getBranchData = [];
const ListProductBranch = ({ prId, editable }) => {
  const [record, setRecord] = useState([]);
  const alert = useAlert();
  const fetchData = () => {
    storageService
      .getAllBranchThatHaveProduct(prId)
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
      .removeList(prId, branchId)
      .then(res => {
        alert.show("ลบข้อมูลออกจากคลังสินค้าสำเร็จ!", { type: 'success' });
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
      .getAllBranchThatHaveProduct(prId)
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
        return <span>{record.branch.brName}</span>;
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
              <FontAwesomeIcon
                onClick={() => {
                  deleteRecord(record.branch.brId);
                }}
                style={{ right: 20, position: 'absolute', color: '#C96480' }}
                icon={faMinusCircle}
              />
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
