import React, { useEffect, useState } from 'react';
import { List, Card, Image } from 'antd';
import { Button } from 'react-bootstrap';
import BranchesService from 'services/branches.service';
import { useHistory } from 'react-router-dom';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import branchesService from 'services/branches.service';
import { useAlert } from 'react-alert';

var getBranchData = [];
const BranchList = () => {
  const { promiseInProgress } = usePromiseTracker({
    area: branchesService.area.getAllBranch,
  });
  const alert = useAlert();
  const [record, setRecord] = useState([]);
  let history = useHistory();

  useEffect(() => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    const fetchData = async () => {
      await trackPromise(
        BranchesService.getAllBranch()
          .then(res => {
            if (mounted) {
              getBranchData = res.data;
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
          }),
        branchesService.area.getAllBranch,
      );
    };
    fetchData();
    return () => (mounted = false);
  }, [setRecord]);
  const openRecord = branchId => {
    history.push('/dashboard/branch/getBranch/' + branchId);
  };
  return (
    <>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={record}
        pagination={{ pageSize: 4, showSizeChanger: false }}
        loading={promiseInProgress}
        renderItem={item => (
          <List.Item>
            <Card
              style={{
                borderRadius: '36px',
                padding: '0 10px 0 10px',
                fontFamily: 'Prompt',
                fontSize: '14px',
              }}
              className="add-dimension">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 114,
                  columnGap: '10px',
                }}>
                <div style={{ flex: 1.5 }}>
                  <Image
                    width="100%"
                    height="100%"
                    style={{
                      objectFit: 'cover',
                    }}
                    src={item?.image?.imgObj ? item?.image?.imgObj : 'error'}
                    fallback="data:image/png;base64,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"
                  />
                </div>
                <div
                  style={{
                    padding: '15px 0',
                    display: 'flex',
                    flex: 1,
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <div style={{ fontWeight: 'bold' }}>ชื่อสาขา</div>
                  <div style={{ fontWeight: 'bold' }}>ที่อยู่</div>
                  <div style={{ fontWeight: 'bold' }}>เบอร์โทร</div>
                </div>
                <div
                  style={{
                    padding: '15px 0',
                    display: 'flex',
                    flex: 3,
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    color: '#BDBDBD',
                  }}>
                  <div
                    style={{
                      borderColor: '#E8E8E8',
                      borderStyle: 'solid',
                      borderWidth: '0.155rem',
                      borderRadius: '8px',
                      paddingLeft: 10,
                    }}>
                    {item.branchName || 'none'}
                  </div>
                  <div
                    style={{
                      width: '350px',
                      borderColor: '#E8E8E8',
                      borderStyle: 'solid',
                      borderWidth: '0.155rem',
                      borderRadius: '8px',
                      paddingLeft: 10,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}>
                    {item.branchAddr || 'none'}
                  </div>
                  <div
                    style={{
                      borderColor: '#E8E8E8',
                      borderStyle: 'solid',
                      borderWidth: '0.155rem',
                      borderRadius: '8px',
                      paddingLeft: 10,
                    }}>
                    {item.branchTel || 'none'}
                  </div>
                </div>
                <div style={{ flex: 2 }} />
                <div
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}>
                  <Button
                    variant="secondary"
                    style={{
                      width: '120px',
                      height: 40,
                      padding: 0,
                      borderRadius: 5,
                      color: 'white',
                      boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
                    }}
                    onClick={() => {
                      openRecord(item.branchId);
                    }}>
                    เพิ่มเติม
                  </Button>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default BranchList;
