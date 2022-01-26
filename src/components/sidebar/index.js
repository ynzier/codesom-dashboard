/* eslint-disable import/no-anonymous-default-export */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {
  CgPushChevronLeft,
  CgPushChevronRight,
  CgGitBranch,
  CgFileDocument,
} from 'react-icons/cg';
import { FiUsers } from 'react-icons/fi';
import { MdSpaceDashboard, MdDeliveryDining } from 'react-icons/md';
import { FaWarehouse } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { Button } from 'react-bootstrap';
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
import AuthService from 'services/auth.service';

export default (props = {}) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Accessing scss variable "--background-color"
    // and "--text-color" using plain JavaScript
    // and changing the same according to the state of "darkTheme"
    const root = document.documentElement;
    root?.style.setProperty('--contentMargin', collapsed ? '80px' : '270px');
  }, [collapsed]);

  const logOut = () => {
    AuthService.logout();
  };
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
        <SidebarHeader>
          <div
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
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="circle" subMenuBullets>
            <MenuItem icon={<MdSpaceDashboard />}>
              แดชบอร์ด
              <Link to={Routes.Home.path} />
            </MenuItem>
            <SubMenu title="บุคลากร" icon={<FiUsers />}>
              <MenuItem>
                จัดการผู้ใช้งาน
                <Link to={Routes.UserList.path} />
              </MenuItem>
              <MenuItem>
                จัดการพนักงาน
                <Link to={Routes.EmployeeList.path} />
              </MenuItem>
              <MenuItem>
                กำหนดสิทธิ์ผู้ใช้งาน
                <Link to={Routes.AddPermission.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu title="สาขา" icon={<CgGitBranch />}>
              <MenuItem>จัดการสาขา</MenuItem>
            </SubMenu>
            <SubMenu title="วัตถุดิบ" icon={<FaWarehouse />}>
              <MenuItem>คำร้องขอวัตถุดิบ</MenuItem>
              <MenuItem>ประวัติการเบิกวัตถุดิบ</MenuItem>
            </SubMenu>
            <SubMenu title="เดลิเวอรี่" icon={<MdDeliveryDining />}>
              <MenuItem>รายการที่ต้องส่ง</MenuItem>
              <MenuItem>ประวัติการส่งสินค้า</MenuItem>
            </SubMenu>
            <SubMenu title="รายงาน" icon={<CgFileDocument />}>
              <MenuItem>รายงานวัตถุดิบ</MenuItem>
              <MenuItem>รายงานยอดจำหน่าย</MenuItem>
              <MenuItem>รายงานข้อมูลพนักงาน</MenuItem>
            </SubMenu>
          </Menu>
        </SidebarContent>
        <SidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 24px',
            }}>
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
          </div>
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};
