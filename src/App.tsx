import React, { useMemo, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  getExchangeRate,
  getSaleContractTokenBalance,
  getTotalSale,
  getTotalSupply,
  isUserExist,
  showNotification,
} from "./utils";
import {
  setExchangeRate,
  setTokenSold,
  setTokenToSale,
  setTotalSupply,
  setUserDataExists,
} from "./store/wallet/wallet.slice";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Home from "./pages";
// import ContactUs from "./pages/ContactUs";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";
import { WalletConnectAdapter } from "@tronweb3/tronwallet-adapter-walletconnect";
import {
  WalletProvider,
  useWallet,
} from "@tronweb3/tronwallet-adapter-react-hooks";
import {
  WalletActionButton,
  WalletModalProvider,
} from "@tronweb3/tronwallet-adapter-react-ui";
import {
  WalletDisconnectedError,
  WalletError,
  WalletNotFoundError,
} from "@tronweb3/tronwallet-abstract-adapter";

function App() {
  const dispatch = useDispatch();
  const windowInstance = window as any;
  React.useEffect(() => {
    getExchangeRate().then((res: any) => {
      console.log(res);
      dispatch(setExchangeRate(res));
    });
    getTotalSupply().then((res: any) => {
      dispatch(setTotalSupply(res));
    });
    getTotalSale().then((res: any) => {
      dispatch(setTokenSold(res));
    });
    getSaleContractTokenBalance().then((res: any) => {
      dispatch(setTokenToSale(res));
    });
  }, [dispatch, windowInstance.tronWeb]);

  function onError(e: WalletError) {
    if (e instanceof WalletNotFoundError) {
      showNotification(e.message, "error");
    } else if (e instanceof WalletDisconnectedError) {
      showNotification(e.message, "error");
    } else showNotification(e.message, "error");
  }

  const adapters = useMemo(function () {
    const tronLinkAdapter = new TronLinkAdapter();
    const walletConnectAdapter = new WalletConnectAdapter({
      network: "Mainnet",
      options: {
        relayUrl: "wss://relay.walletconnect.com",
        // example WC app project ID
        projectId: "a18c7e248b10560477a47c190e778e2a",
        metadata: {
          name: "U House Private sale",
          description: "U House Private sale",
          url: "",
          icons: [""],
        },
      },
      web3ModalConfig: {
        themeMode: "dark",
        themeVariables: {
          "--w3m-z-index": "1000",
        },
      },
    });
    return [tronLinkAdapter, walletConnectAdapter];
  }, []);

  const { address } = useWallet();

  useEffect(() => {
    // if (!address) return;
    // tronWeb.setAddress(address);
    (async () => {
      if (!address) return;
      const isUserExists = await isUserExist(address?.toLowerCase());

      if (isUserExists?.status) {
        setUserDataExists(true as any);
      }
    })();

    adapters.forEach((adapter) => {
      adapter.on("readyStateChanged", async () => {
        console.log("readyState: ", adapter.readyState);
      });
      adapter.on("connect", async (address) => {
        const isUserExists = await isUserExist(address?.toLowerCase());
        if (isUserExists?.status) {
          dispatch(setUserDataExists(true as any));
        }
      });
      adapter.on("accountsChanged", async (data, preaddr) => {
        debugger;
        dispatch(setUserDataExists(false as any));
        const isUserExists = await isUserExist(data?.toLowerCase());
        debugger;
        if (isUserExists?.status) {
          dispatch(setUserDataExists(true as any));
        }
      });

      adapter.on("disconnect", () => {
        dispatch(setUserDataExists(false as any));
      });

      return () => {
        adapter.removeAllListeners();
      };
    });

    return () => {
      adapters.forEach((adapter) => {
        adapter.removeAllListeners();
      });
    };
  }, [adapters, address, dispatch]);

  return (
    <div className="app">
      <WalletProvider
        onError={onError}
        autoConnect={true}
        disableAutoConnectOnLoad={true}
        adapters={adapters}
      >
        <WalletModalProvider>
          <BrowserRouter>
            <Header connectComponent={ConnectWalletComponent} />
            <div className="layout">
              {/* <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes> */}
              <Home />
            </div>
            <Footer />
          </BrowserRouter>
          {/* <ConnectWalletComponent /> */}
        </WalletModalProvider>
      </WalletProvider>
    </div>
  );
}

function ConnectWalletComponent() {
  return (
    <WalletActionButton className="btn btn-primary" style={{ width: "100%" }}>
      Connect Wallet
    </WalletActionButton>
  );
}

export default App;
