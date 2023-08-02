import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Building from "../assets/imgs/building.png";
import { useSelector } from "react-redux";
import { formatNumber } from "../utils";
function Hero() {
  const { totalSupply, tokenSold } = useSelector((state: any) => state?.wallet);

  return (
    <div className="hero pt-7 pt-md-10">
      <Container className="pb-10">
        <Row className="align-items-center">
          <Col md="7">
            <h2 className="heading mb-0">
              Welcome to <br /> uHouse
            </h2>
            <div className="mt-5 text-center text-md-start">
              <Button>Buy Token</Button>
            </div>
            <div className="d-flex align-items-center justify-content-between justify-content-md-start mt-5">
              <div className="me-0 me-md-5">
                <h2 className="token">
                  {formatNumber(totalSupply, 0) || 0} TKN
                </h2>
                <h5 className="desc">Circulating Supply</h5>
              </div>
              <div>
                <h2 className="token">{formatNumber(tokenSold, 0) || 0} TKN</h2>
                <h5 className="desc">Token Sold</h5>
              </div>
            </div>
          </Col>
          <Col md="5">
            <img
              src={Building}
              alt="hero"
              draggable="false"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Hero;
