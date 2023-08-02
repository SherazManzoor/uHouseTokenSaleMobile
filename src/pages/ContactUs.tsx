import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Container, Input, Row } from "reactstrap";
import { contactUs } from "../utils";
import { toast } from "react-toastify";
import { setUserDataExists } from "../store/wallet/wallet.slice";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";

const ContactUs = () => {
  const { tokenBalance } = useSelector((state: any) => state?.wallet);

  const dispatch = useDispatch();

  const { address } = useWallet();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoader(true);
      await contactUs(name, email, address || "", tokenBalance);
      const status: any = true;
      dispatch(setUserDataExists(status));
      toast.success("Data Submitted Successfully");

      setName("");
      setEmail("");
      setLoader(false);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
      setLoader(false);
    }
  };

  return (
    <Container>
      <Row className="pt-5 pt-md-7 justify-content-center">
        <Col lg="7">
          <div className="contact-us">
            <div className="card">
              <h2 className="heading mb-0">Please Enter Your Details</h2>
              <hr />
              <div>
                <p className="balance mb-1">Name </p>
                <Input
                  type="text"
                  placeholder="Please Enter your Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <p className="balance mb-1 mt-3">Email </p>
                <Input
                  type="email"
                  placeholder="Please Enter your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <p className="balance mb-1 mt-3">Address </p>
                <Input
                  type="text"
                  readOnly
                  placeholder="0x"
                  value={address || ""}
                />
                <p className="balance mb-1 mt-3">Token Balance </p>
                <Input
                  type="number"
                  readOnly
                  placeholder="50,000"
                  value={tokenBalance}
                />
                <Button
                  className="mt-3"
                  block
                  disabled={!address || !email || !name}
                  onClick={handleSubmit}
                >
                  {loader ? (
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="spinner-border spinner-border-sm text-light"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
