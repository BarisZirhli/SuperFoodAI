import React from 'react';
import { Button, Navbar, Nav } from 'react-bootstrap';

function Header() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">SuperFoodAI</Navbar.Brand>
      <Nav className="ml-auto">
        <Button variant="outline-primary" className="mr-2" href='/'>Favorites</Button>
        <Button variant="outline-primary">Signup</Button>
      </Nav>
    </Navbar>
  );
}

export default Header;
