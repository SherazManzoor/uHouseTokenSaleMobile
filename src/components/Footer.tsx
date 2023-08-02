import React from "react";
import { Container } from "reactstrap";

const Footer = () => {
  return (
    <div className="footer">
      <Container>
        <h2 className="logo mb-0">uHouse Private Sale</h2>
        <div className="text-center">
          <small> ©{new Date()?.getFullYear()}. All Rights Reserved</small>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
