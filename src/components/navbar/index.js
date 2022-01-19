/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignOutAlt,
  faHome,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import {
  Row,
  Col,
  Nav,
  Image,
  Navbar,
  Dropdown,
  Container,
  Button,
  ListGroup,
  Breadcrumb,
} from 'react-bootstrap';

import Profile3 from 'assets/img/jib.png';
import AuthService from 'services/auth.service';

export default () => {
  const logOut = () => {
    AuthService.logout();
  };

  return (
    <>
      <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0 mb-2">
        <Container fluid className="px-0">
         <Nav className="align-items-center">
              <Breadcrumb
                className="d-none d-md-inline-block"
                listProps={{
                  className: 'breadcrumb-dark breadcrumb-transparent',
                }}>
                <Breadcrumb.Item active>
                  <FontAwesomeIcon icon={faHome} />
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
              </Breadcrumb>
              </Nav>
            <Nav className="align-items-center">
              <Dropdown as={Nav.Item}>
                <Dropdown.Toggle as={Nav.Link} className="pt-0 px-0">
                  <div className="media d-flex align-items-center">
                    <Image
                      src={Profile3}
                      className="user-avatar md-avatar rounded-circle"
                    />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                  <Dropdown.Item
                    className="fw-bold"
                    onClick={() => {
                      logOut();
                      window.location = '/';
                    }}>
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className="text-danger me-2"
                    />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
        </Container>
      </Navbar>
    </>
  );
};
