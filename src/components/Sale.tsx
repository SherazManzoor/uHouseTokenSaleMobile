import React from "react";
import { Container, Row, Col, Input, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { showNotification, tronWeb } from "../utils";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { contracts } from "../config";
import { setTokenAllowance, setTokenSold } from "../store/wallet/wallet.slice";

const Sale = () => {
  const {
    usdtBalance,
    tokenBalance,
    exchangeRate,
    tokenAllowance,
    referralReward,
    tokenToSale,
  } = useSelector((state: any) => state?.wallet);

  const { address, signTransaction } = useWallet();

  const [token, setToken] = React.useState(0);
  const [usdt, setUsdt] = React.useState(0);

  const [loader, setLoader] = React.useState(false);

  const dispatch = useDispatch();

  const approveHandler = async (amount: number) => {
    try {
      if (!address) {
        showNotification("Please connect wallet first", "error");
        return null;
      }

      const amountInSun = tronWeb.toSun(amount, 6);
      const parameters = [
        {
          type: "address",
          value: contracts?.tokenSaleAddress,
        },
        {
          type: "uint256",
          value: amountInSun,
        },
      ];
      const transaction =
        await tronWeb?.transactionBuilder?.triggerSmartContract(
          contracts?.tetherAddress,
          "approve(address,uint256)",
          { feeLimit: 20 * 1e6 },
          parameters
        );
      console.log("amountInSun", amountInSun);

      const res = await signTransaction(transaction?.transaction);

      await tronWeb.trx.sendRawTransaction(res);
      dispatch(setTokenAllowance(amountInSun));
      showNotification(`Approved ${amount} USDT`, "success");
    } catch (e) {
      console.log(e);
      showNotification("Something went wrong", "error");
    }
  };

  const { tokenSold } = useSelector((state: any) => state?.wallet);

  const buyTokensHandler = async (amount: number, referer: string) => {
    try {
      if (!address) {
        showNotification("Please connect wallet first", "error");
        return null;
      }

      const amountInSun = tronWeb.toSun(amount, 6);

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

      const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contracts?.tokenSaleAddress,
        "buyTokens(uint256,address)",
        { feeLimit: 20 * 1e6 },
        parameters
      );

      const res = await signTransaction(transaction?.transaction);

      await tronWeb.trx.sendRawTransaction(res);

      const previousSold = tokenSold;
      const newSold: any = previousSold + Number(amount);
      dispatch(setTokenSold(newSold));
      showNotification(`Bought ${amount} tokens`, "success");
      return transaction;
      // } else {
      //     showNotification("TronLink not installed", "error")
      //     return null;
      // }
    } catch (err) {
      console.log(err);
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
                  onChange={(e: any) => {
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
                      .then((res: any) => {
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
                      .then((res: any) => {
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
