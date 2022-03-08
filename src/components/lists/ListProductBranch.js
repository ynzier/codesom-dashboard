import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { right } from 'holderjs';
import storageService from 'services/storage.service';
import { text } from '@fortawesome/fontawesome-svg-core';

var getBranchData = [];
const ListProductBranch = ({ prId, editable }) => {
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  let history = useHistory();
  const fetchData = async () => {
    await storageService
      .getAllBranchThatHaveProduct(prId)
      .then(res => {
        getBranchData = res.data;
        setRecord(getBranchData);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
        setLoading(false);
      });
  };
  const deleteRecord = async branchId => {
    await storageService
      .removeList(prId, branchId)
      .then(res => {
        fetchData();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    await storageService
      .getAllBranchThatHaveProduct(prId)
      .then(res => {
        if (mounted) {
          getBranchData = res.data;
          setRecord(getBranchData);
          setLoading(false);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
        setLoading(false);
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
                  deleteRecord(record.branchId);
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

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
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
