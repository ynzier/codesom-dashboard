import React, { useState, useEffect } from 'react';

import {
  CgPushChevronLeft,
  CgPushChevronRight,
  CgFileDocument,
} from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { GiCubes } from 'react-icons/gi';
import { MdDeliveryDining } from 'react-icons/md';
import { FaWarehouse } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { Select } from 'antd';
import { Routes } from 'routes';
import './styles.scss';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from 'react-pro-sidebar';
import branchesService from 'services/branches.service';

const { Option } = Select;

const Sidebar = props => {
  const { selectBranch, setSelectBranch } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(2);
  const [branchList, setBranchList] = useState([]);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty('--contentMargin', collapsed ? '80px' : '270px');
  }, [collapsed]);
  const fetchBranchList = () => {
    branchesService
      .getBranchByManager()
      .then(res => {
        setBranchList(res.data);
        setSelectBranch(res.data[0].branchId);
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchBranchList();

    return () => {};
  }, []);

  return (
    <>
      <ProSidebar
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
        collapsed={collapsed}>
        <SidebarHeader
          style={{
            padding: '24px',
          }}>
          <div
            style={{
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: 14,
              letterSpacing: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            className="mb-2">
            Codesom (Manager)
          </div>
          {!collapsed && (
            <Select
              style={{ width: '100%', fontFamily: 'Prompt' }}
              placeholder="เลือกสาขา"
              optionFilterProp="children"
              dropdownStyle={{ fontFamily: 'Prompt' }}
              onChange={value => setSelectBranch(value)}
              value={selectBranch}>
              {branchList.map(option => (
                <Option key={option.branchId} value={option.branchId}>
                  {option.branchName}
                </Option>
              ))}
            </Select>
          )}
        </SidebarHeader>
        {selectBranch != null && (
          <SidebarContent>
            <Menu iconShape="circle">
              <SubMenu
                title="รายงาน"
                onClick={() => {
                  if (open != 1) setOpen(1);
                }}
                open={open == 1}
                icon={<CgFileDocument color="#9D7463" size="16px" />}>
                <MenuItem
                  active={active == 1}
                  onClick={() => {
                    setActive(1);
                  }}>
                  ๐ รายงานการใช้วัตถุดิบ <Link to={Routes.ReportIngr.path} />
                </MenuItem>
                <MenuItem
                  active={active == 2}
                  onClick={() => {
                    setActive(2);
                  }}>
                  ๐ รายงานยอดจำหน่าย
                  <Link to={Routes.ReportSale.path} />
                </MenuItem>
                <MenuItem
                  active={active == 3}
                  onClick={() => {
                    setActive(3);
                  }}>
                  ๐ รายงานข้อมูลพนักงาน <Link to={Routes.ReportEmp.path} />
                </MenuItem>
              </SubMenu>
              <SubMenu
                onClick={() => {
                  if (open != 2) setOpen(2);
                }}
                open={open == 2}
                title="บุคลากร"
                icon={<FiUsers color="#9D7463" />}>
                <MenuItem
                  active={active == 4}
                  onClick={() => {
                    setActive(4);
                  }}>
                  ๐ รายชื่อพนักงาน
                  <Link
                    to={{
                      pathname: Routes.EmployeeList.path,
                      state: { isManager: true },
                    }}
                  />
                </MenuItem>
              </SubMenu>
              <SubMenu
                onClick={() => {
                  if (open != 3) setOpen(3);
                }}
                open={open == 3}
                title="สินค้าและวัตถุดิบ"
                icon={<GiCubes size="20px" color="#9D7463" />}>
                <MenuItem
                  active={active == 5}
                  onClick={() => {
                    setActive(5);
                  }}>
                  ๐ สินค้า
                  <Link
                    to={{
                      pathname: Routes.ProductList.path,
                      state: { isManager: true },
                    }}
                  />
                </MenuItem>
                <MenuItem
                  active={active == 6}
                  onClick={() => {
                    setActive(6);
                  }}>
                  ๐ วัตถุดิบและอื่นๆ
                  <Link
                    to={{
                      pathname: Routes.IngrAndStuffList.path,
                      state: { isManager: true },
                    }}
                  />
                </MenuItem>
                <MenuItem
                  active={active == 7}
                  onClick={() => {
                    setActive(7);
                  }}>
                  ๐ โปรโมชัน
                  <Link
                    to={{
                      pathname: Routes.PromotionList.path,
                      state: { isManager: true },
                    }}
                  />
                </MenuItem>
              </SubMenu>
              <SubMenu
                onClick={() => {
                  if (open != 4) setOpen(4);
                }}
                open={open == 4}
                title="ประวัติรายการ"
                icon={<FaWarehouse color="#9D7463" />}>
                <MenuItem
                  active={active == 8}
                  onClick={() => {
                    setActive(8);
                  }}>
                  ๐ ประวัติออเดอร์
                  <Link
                    to={{
                      pathname: Routes.OrderHistory.path,
                      state: { isManager: true },
                    }}
                  />
                </MenuItem>
                <MenuItem
                  active={active == 9}
                  onClick={() => {
                    setActive(9);
                  }}>
                  ๐ ประวัติการเบิกจ่ายสินค้า
                  <Link to={Routes.RequisitionList.path} />
                </MenuItem>
              </SubMenu>
              <SubMenu
                onClick={() => {
                  if (open != 5) setOpen(5);
                }}
                open={open == 5}
                title="คลังสินค้า"
                icon={<FaWarehouse color="#9D7463" />}>
                <MenuItem
                  active={active == 10}
                  onClick={() => {
                    setActive(10);
                  }}>
                  ๐ สร้างใบเบิกสินค้า
                  <Link to={Routes.CreateRequisition.path} />
                </MenuItem>
                <MenuItem
                  active={active == 11}
                  onClick={() => {
                    setActive(11);
                  }}>
                  ๐ คลังสาขา
                  <Link to={Routes.BranchWarehouse.path} />
                </MenuItem>
              </SubMenu>
              <SubMenu
                onClick={() => {
                  if (open != 6) setOpen(6);
                }}
                open={open == 6}
                title="เดลิเวอรี"
                icon={<MdDeliveryDining color="#9D7463" size="20px" />}>
                <MenuItem
                  active={active == 12}
                  onClick={() => {
                    setActive(12);
                  }}>
                  ๐ รายการเดลิเวอรี <Link to={Routes.DeliveryHistory.path} />
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
        )}
        <SidebarFooter style={{ textAlign: 'center', padding: '20px 24px' }}>
          {collapsed ? (
            <CgPushChevronRight
              style={{
                fontSize: 24,
                right: 0,
              }}
              onClick={() => setCollapsed(!collapsed)}
            />
          ) : (
            <CgPushChevronLeft
              style={{
                fontSize: 24,
                right: 0,
              }}
              onClick={() => setCollapsed(!collapsed)}
            />
          )}
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};

export default Sidebar;
