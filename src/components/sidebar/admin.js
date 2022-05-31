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

import { Link, useLocation, matchPath, useHistory } from 'react-router-dom';

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
  const location = useLocation();
  const history = useHistory();
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(undefined);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty('--contentMargin', collapsed ? '80px' : '270px');
  }, [collapsed]);
  useEffect(() => {
    if (matchPath(location.pathname, { path: Routes.ReportIngr.path })) {
      setOpen(1);
      setActive(1);
    } else if (matchPath(location.pathname, { path: Routes.ReportSale.path })) {
      setOpen(1);
      setActive(2);
    } else if (matchPath(location.pathname, { path: Routes.ReportEmp.path })) {
      setOpen(1);
      setActive(3);
    } else if (
      matchPath(location.pathname, { path: Routes.UserList.path }) ||
      matchPath(location.pathname, { path: Routes.AddPermission.path })
    ) {
      setOpen(2);
      setActive(4);
    } else if (
      matchPath(location.pathname, { path: Routes.EmployeeList.path }) ||
      matchPath(location.pathname, { path: Routes.GetEmployee.path }) ||
      matchPath(location.pathname, { path: Routes.CreateNewEmployee.path })
    ) {
      setOpen(2);
      setActive(5);
    } else if (
      matchPath(location.pathname, { path: Routes.BranchLists.path }) ||
      matchPath(location.pathname, { path: Routes.AddBranch.path }) ||
      matchPath(location.pathname, { path: Routes.GetBranch.path })
    ) {
      setOpen(3);
      setActive(6);
    } else if (
      matchPath(location.pathname, { path: Routes.ProductList.path }) ||
      matchPath(location.pathname, { path: Routes.AddProduct.path }) ||
      matchPath(location.pathname, { path: Routes.GetProduct.path })
    ) {
      setOpen(4);
      setActive(7);
    } else if (
      matchPath(location.pathname, { path: Routes.IngrAndStuffList.path })
    ) {
      setOpen(4);
      setActive(8);
    } else if (
      matchPath(location.pathname, { path: Routes.PromotionList.path }) ||
      matchPath(location.pathname, { path: Routes.AddPromotion.path }) ||
      matchPath(location.pathname, { path: Routes.GetPromotion.path })
    ) {
      setOpen(4);
      setActive(9);
    } else if (
      (matchPath(location.pathname, { path: Routes.OrderHistory.path }) ||
        matchPath(location.pathname, { path: Routes.GetOrder.path })) &&
      location.state?.from != Routes.DeliveryHistory.path
    ) {
      setOpen(5);
      setActive(10);
    } else if (
      matchPath(location.pathname, { path: Routes.RequisitionList.path }) ||
      matchPath(location.pathname, { path: Routes.GetRequisition.path })
    ) {
      setOpen(5);
      setActive(11);
    } else if (
      matchPath(location.pathname, { path: Routes.CreateRequisition.path })
    ) {
      setOpen(6);
      setActive(12);
    } else if (
      matchPath(location.pathname, { path: Routes.BranchWarehouse.path })
    ) {
      setOpen(6);
      setActive(13);
    } else if (
      matchPath(location.pathname, { path: Routes.DeliveryHistory.path }) ||
      location.state?.from == Routes.DeliveryHistory.path
    ) {
      setOpen(7);
      setActive(14);
    }
    return () => {};
  }, [location, history]);
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
              title={'รายงาน'}
              onClick={() => {
                if (open !== 1) setOpen(1);
                else setOpen(undefined);
              }}
              open={open == 1}
              icon={<CgFileDocument color="#9D7463" size="16px" />}>
              <MenuItem active={active == 1}>
                ๐ รายงานการใช้วัตถุดิบ <Link to={Routes.ReportIngr.path} />
              </MenuItem>
              <MenuItem active={active == 2}>
                ๐ รายงานยอดจำหน่าย
                <Link to={Routes.ReportSale.path} />
              </MenuItem>
              <MenuItem active={active == 3}>
                ๐ รายงานข้อมูลพนักงาน
                <Link to={Routes.ReportEmp.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="บุคลากร"
              open={open == 2}
              onClick={() => {
                if (open !== 2) setOpen(2);
                else setOpen(undefined);
              }}
              icon={<FiUsers color="#9D7463" />}>
              <MenuItem active={active == 4}>
                ๐ รายชื่อผู้ใช้งาน
                <Link to={Routes.UserList.path} />
              </MenuItem>
              <MenuItem active={active == 5}>
                ๐ รายชื่อพนักงาน
                <Link to={Routes.EmployeeList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สาขา"
              open={open == 3}
              onClick={() => {
                if (open !== 3) setOpen(3);
                else setOpen(undefined);
              }}
              icon={<CgGitBranch color="#9D7463" size="24px" />}>
              <MenuItem active={active == 6}>
                ๐ รายชื่อสาขา
                <Link to={Routes.BranchLists.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="สินค้าและวัตถุดิบ"
              open={open == 4}
              onClick={() => {
                if (open !== 4) setOpen(4);
                else setOpen(undefined);
              }}
              icon={<GiCubes size="20px" color="#9D7463" />}>
              <MenuItem active={active == 7}>
                ๐ สินค้า
                <Link to={Routes.ProductList.path} />
              </MenuItem>
              <MenuItem active={active == 8}>
                ๐ วัตถุดิบและอื่นๆ
                <Link to={Routes.IngrAndStuffList.path} />
              </MenuItem>
              <MenuItem active={active == 9}>
                ๐ โปรโมชัน
                <Link to={Routes.PromotionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="ประวัติรายการ"
              open={open == 5}
              onClick={() => {
                if (open !== 5) setOpen(5);
                else setOpen(undefined);
              }}
              icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem active={active == 10}>
                ๐ ประวัติออเดอร์
                <Link to={Routes.OrderHistory.path} />
              </MenuItem>
              <MenuItem active={active == 11}>
                ๐ ประวัติการเบิกจ่ายสินค้า
                <Link to={Routes.RequisitionList.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="คลังสินค้า"
              open={open == 6}
              onClick={() => {
                if (open !== 6) setOpen(6);
                else setOpen(undefined);
              }}
              icon={<FaWarehouse color="#9D7463" />}>
              <MenuItem active={active == 12}>
                ๐ สร้างใบเบิกสินค้า
                <Link to={Routes.CreateRequisition.path} />
              </MenuItem>
              <MenuItem active={active == 13}>
                ๐ คลังสาขา
                <Link to={Routes.BranchWarehouse.path} />
              </MenuItem>
            </SubMenu>
            <SubMenu
              title="เดลิเวอรี"
              open={open == 7}
              onClick={() => {
                if (open !== 7) setOpen(7);
                else setOpen(undefined);
              }}
              icon={<MdDeliveryDining color="#9D7463" size="20px" />}>
              <MenuItem active={active == 14}>
                ๐ รายการเดลิเวอรี <Link to={Routes.DeliveryHistory.path} />
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
