import React from 'react';
import { Button, Navbar, Nav, Container, Row } from 'react-bootstrap';

function Header() {
  return (
    <Container>
      <Row>
    <Navbar className="justify-content-between fixed-top p-4 px-4">
      <Navbar.Brand href="/" className='fs-3'>SuperFoodAI</Navbar.Brand>
      <Nav>
        <Button className="btn btn-success p-2 " href='/favorites'>Favorites</Button>
      </Nav>
    </Navbar>
    </Row>
    </Container>
  );
}

export default Header;
