import React from 'react';
import { Button, Navbar, Nav, Container, Row } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Header.css"
function Header() {
  return (
    <Container className='headerContainer'>
      <Row>
    <Navbar className="justify-content-between fixed-top p-4 px-4">
      <Navbar.Brand href="/" className='fs-3'>SuperFoodAI</Navbar.Brand>
      <Nav>
        <Button className="btn btn-success p-2 mx-1" href='/favorites'>Favorites</Button>
        <Button className="btn btn-warning p-2 mx-1" href='/signup'>Sign Up</Button>
      </Nav>
    </Navbar>
    </Row>
    </Container>
  );
}

export default Header;