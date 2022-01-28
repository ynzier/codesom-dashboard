import React, { useEffect, useState } from 'react';
import { List, Card } from 'antd';
import { Image, Button } from 'react-bootstrap';
import BranchesService from 'services/branches.service';

var getBranchData = [];
const BranchList = () => {
  const [record, setRecord] = useState([]);
  const [filterData, setfilterData] = useState();
  const [loading, setLoading] = useState(true);
  const search = value => {
    const filterTable = record.filter(o =>
      Object.keys(o).some(k =>
        String(o[k]).toLowerCase().includes(value.toLowerCase()),
      ),
    );

    setfilterData(filterTable);
  };

  useEffect(async () => {
    document.title = 'ข้อมูลสาขา';
    let mounted = true;
    await BranchesService.getAllBranch()
      .then(res => {
        if (mounted) {
          console.log(res);
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
                <div style={{ flex: 1 }}>
                  <Image
                    style={{
                      width: '140px',
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
                  <div>ชื่อสาขา</div>
                  <div>ที่อยู่</div>
                  <div>เบอร์โทร</div>
                </div>
                <div
                  style={{
                    padding: '15px 0',
                    display: 'flex',
                    flex: 3,
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                  <div>{item.brName || 'none'}</div>
                  <div>{item.brAddr || 'none'}</div>
                  <div>{item.brTel || 'none'}</div>
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
                      width: 140,
                      height: 40,
                      padding: 0,
                      borderRadius: 20,
                      color: 'white',
                      boxShadow: 'rgb(0 0 0 / 25%) 0px 0.5rem 0.7rem',
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
