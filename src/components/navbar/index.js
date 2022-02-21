import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Nav, Navbar, Dropdown, Container } from 'react-bootstrap';

import AuthService from 'services/auth.service';

const NavbarComponent = () => {
  const logOut = () => {
    AuthService.logoutDashboard();
  };

  return (
    <Navbar
      variant="dark"
      expanded
      className="ps-0 pe-2 pb-0"
      style={{ float: 'right' }}>
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center"></div>
          <Nav className="align-items-center">
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="user-avatar md-avatar rounded-circle2"
                    style={{ color: 'grey' }}
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
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
