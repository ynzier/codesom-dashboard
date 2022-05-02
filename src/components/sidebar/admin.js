import React, { useState, useEffect } from 'react';

import {
  CgPushChevronLeft,
  CgPushChevronRight,
  CgGitBranch,
  CgFileDocument,
} from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { GiCubes } from 'react-icons/gi';
import { MdDeliveryDining } from 'react-icons/md';
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
  const [active, setActive] = useState(2);

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
          Codesom (Admin)
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle">
            <SubMenu
              title="รายงาน"
              icon={<CgFileDocument color="#9D7463" size="16px" />}>
              <MenuItem
                active={active == 1}
                onClick={() => {
                  setActive(1);
                }}>
                รายงานการใช้วัตถุดิบ <Link to={Routes.ReportIngr.path} />
              </MenuItem>
              <MenuItem
                active={active == 2}
                onClick={() => {
                  setActive(2);
                }}>
                รายงานยอดจำหน่าย
                <Link to={Routes.ReportSale.path} />
              </MenuItem>
              <MenuItem
                active={active == 3}
                onClick={() => {
                  setActive(3);
                }}>
                รายงานข้อมูลพนักงาน
              </MenuItem>
            </SubMenu>
            <SubMenu title="บุคลากร" icon={<FiUsers color="#9D7463" />}>
              <MenuItem
                active={active == 4}
                onClick={() => {
                  setActive(4);
                }}>
                ๐ จัดการผู้ใช้งาน
                <Link to={Routes.UserList.path} />
              </MenuItem>
              <MenuItem
                active={active == 5}
                onClick={() => {
                  setActive(5);
                }}>
                ๐ จัดการพนักงาน
                <Link to={Routes.EmployeeList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สาขา"
              icon={<CgGitBranch color="#9D7463" size="24px" />}>
              <MenuItem
                active={active == 6}
                onClick={() => {
                  setActive(6);
                }}>
                ๐ จัดการสาขา
                <Link to={Routes.BranchLists.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สินค้าและวัตถุดิบ"
              icon={<GiCubes size="20px" color="#9D7463" />}>
              <MenuItem
                active={active == 7}
                onClick={() => {
                  setActive(7);
                }}>
                สินค้า
                <Link to={Routes.ProductList.path} />
              </MenuItem>
              <MenuItem
                active={active == 8}
                onClick={() => {
                  setActive(8);
                }}>
                วัตถุดิบและอื่นๆ
                <Link to={Routes.IngrAndStuffList.path} />
              </MenuItem>
              <MenuItem
                active={active == 9}
                onClick={() => {
                  setActive(9);
                }}>
                โปรโมชั่น
                <Link to={Routes.PromotionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="ประวัติรายการ"
              icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem
                active={active == 10}
                onClick={() => {
                  setActive(10);
                }}>
                ประวัติการขาย
                <Link to={Routes.OrderHistory.path} />
              </MenuItem>
              <MenuItem
                active={active == 11}
                onClick={() => {
                  setActive(11);
                }}>
                ประวัติการเบิกจ่ายสินค้า
                <Link to={Routes.RequisitionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu title="คลังสินค้า" icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem
                active={active == 12}
                onClick={() => {
                  setActive(12);
                }}>
                สร้างใบเบิกสินค้า
                <Link to={Routes.CreateRequisition.path} />
              </MenuItem>
              <MenuItem
                active={active == 13}
                onClick={() => {
                  setActive(13);
                }}>
                คลังสาขา
                <Link to={Routes.BranchWarehouse.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="เดลิเวอรี่"
              icon={<MdDeliveryDining color="#9D7463" size="20px" />}>
              <MenuItem
                active={active == 14}
                onClick={() => {
                  setActive(14);
                }}>
                รายการเดลิเวอรี <Link to={Routes.DeliveryHistory.path} />
              </MenuItem>
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
