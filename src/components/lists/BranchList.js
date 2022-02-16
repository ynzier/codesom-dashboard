import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import { Image, Button } from 'react-bootstrap';
import BranchesService from 'services/branches.service';
import { useHistory } from 'react-router-dom';

var getBranchData = [];
const BranchList = props => {
  const [record, setRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  let history = useHistory();

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    await BranchesService.getAllBranch()
      .then(res => {
        if (mounted) {
          getBranchData = res.data;
          setRecord(getBranchData);
          setLoading(false);
        }
      })
      .catch(e => {
        console.log(e);
      });
    return () => (mounted = false);
  }, []);
  const openRecord = brId => {
    history.push('/dashboard/branch/getBranch/' + brId);
  };
  return (
    <>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={record}
        loading={loading}
        pagination={{
          pageSize: 4,
        }}
        renderItem={item => (
          <List.Item>
            <Card
              style={{
                borderRadius: '36px',
                padding: '0 10px 0 10px',
                fontFamily: 'Prompt',
                fontSize: '14px',
              }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 114,
                  columnGap: '10px',
                }}>
                <div style={{ flex: 1.5 }}>
                  <Image
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'grey',
                    }}
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
                    {item.brName || 'none'}
                  </div>
                  <div
                    style={{
                      borderColor: '#E8E8E8',
                      borderStyle: 'solid',
                      borderWidth: '0.155rem',
                      borderRadius: '8px',
                      paddingLeft: 10,
                    }}>
                    {item.brAddr || 'none'}
                  </div>
                  <div
                    style={{
                      borderColor: '#E8E8E8',
                      borderStyle: 'solid',
                      borderWidth: '0.155rem',
                      borderRadius: '8px',
                      paddingLeft: 10,
                    }}>
                    {item.brTel || 'none'}
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
                      openRecord(item.brId);
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
