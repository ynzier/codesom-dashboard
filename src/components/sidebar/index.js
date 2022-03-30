import React, { useState, useEffect } from 'react';

import {
  CgPushChevronLeft,
  CgPushChevronRight,
  CgGitBranch,
  CgFileDocument,
} from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { GiCubes } from 'react-icons/gi';
import { MdSpaceDashboard, MdDeliveryDining } from 'react-icons/md';
import { FaWarehouse } from 'react-icons/fa';

import { Link } from 'react-router-dom';

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

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty('--contentMargin', collapsed ? '80px' : '270px');
  }, [collapsed]);

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
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          Codesom
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem icon={<MdSpaceDashboard color="#9D7463" />}>
              แดชบอร์ด
              <Link to={Routes.Home.path} />
            </MenuItem>
            <SubMenu title="บุคลากร" icon={<FiUsers color="#9D7463" />}>
              <MenuItem>
                ๐ จัดการผู้ใช้งาน
                <Link to={Routes.UserList.path} />
              </MenuItem>
              <MenuItem>
                ๐ จัดการพนักงาน
                <Link to={Routes.EmployeeList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สาขา"
              icon={<CgGitBranch color="#9D7463" size="24px" />}>
              <MenuItem>
                ๐ จัดการสาขา
                <Link to={Routes.BranchLists.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สินค้าและวัตถุดิบ"
              icon={<GiCubes size="20px" color="#9D7463" />}>
              <MenuItem>
                สินค้า
                <Link to={Routes.ProductList.path} />
              </MenuItem>
              <MenuItem>
                วัตถุดิบและอื่นๆ
                <Link to={Routes.IngrAndStuffList.path} />
              </MenuItem>
              <MenuItem>
                โปรโมชั่น
                <Link to={Routes.PromotionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="ประวัติรายการ"
              icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem>
                ประวัติการขาย
                <Link to={Routes.OrderHistory.path} />
              </MenuItem>
              <MenuItem>
                ประวัติการเบิกจ่ายสินค้า
                <Link to={Routes.RequisitionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu title="คลังสินค้า" icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem>
                สร้างใบเบิกสินค้า
                <Link to={Routes.CreateRequisition.path} />
              </MenuItem>
              <MenuItem>
                คลังสาขา
                <Link to={Routes.BranchWarehouse.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="เดลิเวอรี่"
              icon={<MdDeliveryDining color="#9D7463" size="20px" />}>
              <MenuItem>รายการที่ต้องส่ง</MenuItem>
              <MenuItem>ประวัติการส่งสินค้า</MenuItem>
            </SubMenu>
            <SubMenu
              title="รายงาน"
              icon={<CgFileDocument color="#9D7463" size="16px" />}>
              <MenuItem>รายงานประจำวัน</MenuItem>
              <MenuItem>
                รายงานยอดจำหน่าย
                <Link to={Routes.ReportSale.path} />
              </MenuItem>
              <MenuItem>รายงานข้อมูลพนักงาน</MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>
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
