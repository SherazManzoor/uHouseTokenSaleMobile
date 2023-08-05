import React from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { showNotification, tronWeb } from "../utils";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { contracts } from "../config";
import { setTokenAllowance, setTokenSold } from "../store/wallet/wallet.slice";
import { TronWeb } from "@tronweb3/tronwallet-adapters";

const Sale = () => {
  const {
    usdtBalance,
    tokenBalance,
    exchangeRate,
    tokenAllowance,
    referralReward,
    tokenToSale,
  } = useSelector((state) => state?.wallet);

  const { address, signTransaction } = useWallet();

  const [token, setToken] = React.useState(0);
  const [usdt, setUsdt] = React.useState(0);

  const [loader, setLoader] = React.useState(false);

  const dispatch = useDispatch();
  // dispatch(setTokenAllowance(1111111111111111111111));
  const approveHandler = async (amount) => {
    try {
      const tron = window.tron;
      const tronWeb1 = tron?.tronWeb;

      if (!address) {
        showNotification("Please connect wallet first", "error");
        return null;
      }

      if (amount > tokenToSale) {
        showNotification("Sale Contract doesnot have enough tokens.", "error");
        return null;
      }

      const amountInSun = tronWeb?.toSun(amount, 6);
      const parameters = [
        {
          type: "address",
          value: contracts?.tokenSaleAddress,
        },
        {
          type: "uint256",
          value: parseInt(amountInSun),
        },
      ];
      console.log(
        "amountInSun: " +
          amountInSun +
          " - contracts?.tokenSaleAddress: " +
          contracts?.tokenSaleAddress
      );
      const tx = await tronWeb1?.transactionBuilder.triggerSmartContract(
        contracts.tetherAddress,
        "approve(address,uint256)",
        { feeLimit: 150000000, callValue: 0 },
        parameters,
        tronWeb.address.toHex(address)
      );
      console.log("amountInSun", amountInSun);

      const res = await tronWeb1.trx.sign(tx.transaction);

      const result = await tronWeb1.trx.sendRawTransaction(res);
      if (result.result) {
        // alert("Success");
      }
      dispatch(setTokenAllowance(amountInSun));
      showNotification(`Approved ${amount} USDT`, "success");
    } catch (e) {
      console.log(e);
      showNotification("Something went wrong", "error");
    }
  };

  const { tokenSold } = useSelector((state) => state?.wallet);

  const buyTokensHandler = async (amount, referer) => {
    try {
      const tron = window.tron;
      const tronWeb1 = tron?.tronWeb;
      if (!address) {
        showNotification("Please connect wallet first", "error");
        return null;
      }
      if (amount > tokenToSale) {
        showNotification("Sale Contract doesnot have enough tokens.", "error");
        return null;
      }
      console.log("Amount: " + amount);
      const amountInSun = tronWeb.toSun(amount, 6);
      console.log("amountInSun: " + amountInSun);
      const parameters = [
        {
          type: "uint256",
          value: amountInSun,
        },
        {
          type: "address",
          value: referer,
        },
      ];
      console.log(parameters);
      let x = 20 * 1e6;
      const tx = await tronWeb1.transactionBuilder.triggerSmartContract(
        contracts.tokenSaleAddress,
        "buyTokens(uint256,address)",
        { feeLimit: 150000000 },
        parameters
      );

      console.log(x);
      const res = await tronWeb1.trx.sign(tx.transaction);
      console.log(tx.transaction);
      // const result = await tronWeb.trx.sendRawTransaction(res);
      const senttx = await tronWeb1.trx.sendRawTransaction(res);
      console.log("senttx: " + senttx);

      const previousSold = tokenSold;
      const newSold = previousSold + Number(amount);
      dispatch(setTokenSold(newSold));
      showNotification(`Bought ${amount} tokens`, "success");
      return senttx;

      // } else {
      //     showNotification("TronLink not installed", "error")
      //     return null;
      // }
    } catch (err) {
      console.log(err);
      showNotification(
        `Error: Make sure you have enough Energy and Gas fee`,
        "error"
      );
      throw err;
    }
  };

  return (
    <div className="sale mt--8 mb-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg="7">
            <div className="card">
              <h2 className="heading mb-0">Buy</h2>
              <hr />
              <div className="d-flex align-items-center justify-content-between">
                <p className="balance">
                  Token To Sale:{" "}
                  {tokenToSale - token > 0 ? tokenToSale - token : 0 || 0}
                </p>
                <p className="balance">Balance: {tokenBalance} TKN</p>
              </div>
              <div className="input-wrapper">
                <Input
                  type="number"
                  placeholder="50,000"
                  value={token}
                  onChange={(e) => {
                    setToken(e?.target?.value);
                    setUsdt(Number(e?.target?.value) * exchangeRate);
                  }}
                />
                <h2 className="token">TKN</h2>
              </div>
            </div>
            <div className="card mt-2">
              <div className="d-flex align-items-center justify-content-between">
                <p className="balance">
                  Referral Reward: {referralReward || 0}
                </p>
                <p className="balance">Balance: {usdtBalance} USDT</p>
              </div>
              <div className="input-wrapper">
                <Input
                  type="number"
                  placeholder="50,000"
                  value={usdt}
                  disabled={true}
                />
                <h2 className="token">USDT </h2>
              </div>
              <Button
                block
                className="mt-2"
                disabled={
                  loader ||
                  usdt <= 0 ||
                  tokenToSale - token < 0 ||
                  usdt > usdtBalance
                }
                onClick={() => {
                  setLoader(true);
                  if (tokenAllowance >= usdt) {
                    const urlParams = new URLSearchParams(
                      window.location.search
                    );
                    const referralAddress = urlParams.get("ref") || address;
                    console.log("referralAddress", referralAddress);
                    buyTokensHandler(token, referralAddress || "")
                      .then((res) => {
                        setLoader(false);
                        console.log(res);
                        setToken(0);
                        setUsdt(0);
                      })
                      .finally(() => {
                        setLoader(false);
                      });
                  } else {
                    approveHandler(usdt)
                      .then((res) => {
                        setLoader(false);
                        console.log(res);
                      })
                      .finally(() => {
                        setLoader(false);
                      });
                  }
                }}
              >
                {loader && (
                  <div className="spinner-border spinner-border-sm me-2"></div>
                )}
                {tokenAllowance >= usdt ? "Buy Now" : "Approve"}
              </Button>
              {address && (
                <>
                  <Button
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window?.location?.origin}?ref=${address}`
                      );
                    }}
                  >
                    Copy Referral Link
                  </Button>

                  <p className="mt-3 balance">{`${window?.location?.origin}?ref=${address}`}</p>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sale;
