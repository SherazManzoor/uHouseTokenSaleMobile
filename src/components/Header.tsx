import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useNavigate } from "react-router-dom";
import {
  getExchangeRate,
  getReferralBonus,
  getSaleContractTokenBalance,
  getTokenBalance,
  getTotalSale,
  getTotalSupply,
  getUsdtBalance,
  getUsdtTokenAllowance,
} from "../utils";
import { useDispatch } from "react-redux";
import {
  setExchangeRate,
  setReferralReward,
  setTokenAllowance,
  setTokenBalance,
  setTokenSold,
  setTokenToSale,
  setTotalSupply,
  setUsdtBalance,
} from "../store/wallet/wallet.slice";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";

function Header(props: any) {
  const [scrollY, setScrollY] = useState(0); // Initial background color

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // const { address } = useSelector((state: any) => state?.wallet);

  const { address } = useWallet();

  const handleScroll = () => {
    setScrollY(window?.scrollY);
  };

  useEffect(() => {
    // Add a scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the scroll event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (address) {
      getUsdtBalance(address).then((res: any) => {
        dispatch(setUsdtBalance(res));
      });

      getTokenBalance(address).then((res: any) => {
        dispatch(setTokenBalance(res));
      });

      getUsdtTokenAllowance(address).then((res: any) => {
        dispatch(setTokenAllowance(res));
      });

      getExchangeRate().then((res: any) => {
        dispatch(setExchangeRate(res));
      });
      getTotalSupply().then((res: any) => {
        dispatch(setTotalSupply(res));
      });
      getTotalSale().then((res: any) => {
        dispatch(setTokenSold(res));
      });

      getReferralBonus(address).then((res: any) => {
        dispatch(setReferralReward(res));
      });

      getSaleContractTokenBalance().then((res: any) => {
        dispatch(setTokenToSale(res));
      });
    }
  }, [address, dispatch]);

  return (
    <div
      className="header"
      style={{
        backgroundColor: scrollY > 90 ? "#000000" : "#261faa",
      }}
    >
      <Container className="d-flex justify-content-between px-3 px-md-5" fluid>
        <div className="d-flex align-items-center">
          <h2
            className="logo me-3 me-md-8 mb-0"
            onClick={() => {
              navigate("/");
            }}
          >
            <span className="text-white">uHouse</span> Private Sale
          </h2>
          <h4
            className="me-3 me-md-5 mb-0 item mt-1"
            onClick={() => {
              navigate("/");
            }}
          >
            Buy Token
          </h4>
          <h4
            className="me-3 me-md-5 mb-0 item mt-1 d-none"
            onClick={() => {
              navigate("/contact-us");
            }}
          >
            Contact Us
          </h4>
        </div>
        <WalletActionButton></WalletActionButton>
      </Container>
    </div>
  );
}

export default Header;
