import { baseUrl, contracts } from "./config";
import { store } from "./store/store";
import { setTokenAllowance, setTokenSold } from "./store/wallet/wallet.slice";
import { toast } from 'react-toastify';
import axios from "axios";
// import TronWeb from 'tronweb';
const TronWeb = require("tronweb");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
// const privateKey = "b3d65773c80c1e09bb39a765981b9f75c34ff87d86461081eb3c21168a9863e2";
// const tronGridApiKey = "7d30f2e0-7e40-4122-a6dc-36bcf8d15419"

export const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
tronWeb.setAddress("TPFPUNE8GgiPSWGh48o3nKCMk6bawLajPE")
// tronWeb.setHeader({ "TRON-PRO-API-KEY": tronGridApiKey });
// const tronWeb = new TronWeb({
//     fullHost: "https://api.trongrid.io",
//     Headers: {
//         "TRON-PRO-API-KEY": "7d30f2e0-7e40-4122-a6dc-36bcf8d15419"
//     }
// });
// @ts-ignore
// export const tronWeb: any = new TronWeb({
//     fullHost: "https://api.shasta.trongrid.io",
// });
if (typeof window !== 'undefined') {
    (window as any).tronWeb1 = tronWeb;
}


export const showNotification = (message: string, type = 'success') => {
    if (type === 'success') {
        toast.success(message);
    } else {
        toast.error(message);
    }
}

export const formatNumber = (num: number, precision = 2) => {
    const map = [
        { suffix: 'T', threshold: 1e12 },
        { suffix: 'B', threshold: 1e9 },
        { suffix: 'M', threshold: 1e6 },
        { suffix: 'K', threshold: 1e3 },
        { suffix: '', threshold: 1 },
    ];

    const found = map.find((x) => Math.abs(num) >= x.threshold);
    if (found) {
        const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
        return formatted;
    }

    return num;
}

export const connectWallet = async () => {
    try {
        let windowInstance: any = window;

        if (windowInstance?.tronWeb) {
            const tronWeb = windowInstance.tronWeb;
            const account = tronWeb?.defaultAddress?.base58;
            console.log("tronWeb", tronWeb)
            console.log("account", account)
            return account;

        } else {
            showNotification("TronLink not installed", "error")
            return null;
        }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const getUsdtBalance = async (address: string) => {
    try {
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tetherContract = await tronWeb.contract(contracts?.tetherABI, contracts?.tetherAddress);

        const usdtBalance = await tetherContract?.balanceOf(address).call();

        const usdtBalanceInTrx = tronWeb.fromSun(usdtBalance, 6);

        return Number(usdtBalanceInTrx);
        // } else {
        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const getUsdtTokenAllowance = async (address: string) => {
    try {
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tetherContract = await tronWeb.contract(contracts?.tetherABI, contracts?.tetherAddress);

        const usdtTokenAllowance = await tetherContract.allowance(address, contracts?.tokenSaleAddress).call();

        const usdtTokenAllowanceInTrx = tronWeb.fromSun(usdtTokenAllowance, 6);

        return Number(usdtTokenAllowanceInTrx);
        // } else {
        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}


export const getTokenBalance = async (address: string) => {
    try {
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenContract = await tronWeb.contract(contracts?.tokenABI, contracts?.tokenAddress);

        const tokenBalance = await tokenContract.balanceOf(address).call();

        const tokenBalanceInTrx = tronWeb.fromSun(tokenBalance, 6);
        return Number(tokenBalanceInTrx);
        // } else {
        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const getExchangeRate = async () => {
    try {
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenSaleContract = await tronWeb.contract(contracts?.tokenSaleABI, contracts?.tokenSaleAddress);

        const exchangeRate = await tokenSaleContract.exchangeRate().call();

        return Number(exchangeRate) / 1000000;
        // }
        // else {
        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const getTotalSupply = async () => {
    try {
        // token total supply
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenContract = await tronWeb.contract(contracts?.tokenABI, contracts?.tokenAddress);

        const totalSupply = await tokenContract.totalSupply().call();
        const totalSupplyInTrx = tronWeb.fromSun(totalSupply, 6);
        return Number(totalSupplyInTrx);
        // } else {
        //     return null;
        // }

    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const getTotalSale = async () => {
    try {
        // token sale total sale
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenSaleContract = await tronWeb.contract(contracts?.tokenSaleABI, contracts?.tokenSaleAddress);

        const totalSale = await tokenSaleContract.totalsale().call();

        const totalSaleInTrx = tronWeb.fromSun(totalSale, 6);

        return Number(totalSaleInTrx);
        // }
        // else {
        //     return null;
        // }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getReferralBonus = async (address: string) => {
    try {
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenSaleContract = await tronWeb.contract(contracts?.tokenSaleABI, contracts?.tokenSaleAddress);

        const referralBonus = await tokenSaleContract.refCommissionEarned(address).call();

        const referralBonusInTrx = tronWeb.fromSun(referralBonus, 6);

        return Number(referralBonusInTrx);

        // } else {
        //     return null;
        // }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getSaleContractTokenBalance = async () => {
    try {
        // token sale contract token balance
        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tokenContract = await tronWeb.contract(contracts?.tokenABI, contracts?.tokenAddress);
        const tokenBalance = await tokenContract.balanceOf(contracts?.tokenSaleAddress).call();
        const tokenBalanceInTrx = tronWeb.fromSun(tokenBalance, 6);

        return Number(tokenBalanceInTrx);
        // } else {
        //     return null;
        // }
    } catch (err) {
        console.log(err)
        throw err
    }
}


export const approveAmount = async (amount: number, address: string) => {
    try {
        if (!address) {
            showNotification("Please connect wallet first", "error")
            return null;
        }

        // let windowInstance: any = window;

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;

        const tetherContract = await tronWeb.contract(contracts?.tetherABI, contracts?.tetherAddress);

        const amountInSun = tronWeb.toSun(amount, 6);
        console.log("amountInSun", amountInSun)
        const tx = await tetherContract.approve(contracts?.tokenSaleAddress, amountInSun).send({ from: address });
        store.dispatch(setTokenAllowance(amountInSun))
        showNotification(`Approved ${amount} USDT`, "success")
        return tx;
        // } else {
        //     showNotification("TronLink not installed", "error")

        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const buyTokens = async (amount: number, referer: string, address: string) => {
    try {
        const state = store.getState();

        if (!address) {
            showNotification("Please connect wallet first", "error")
            return null;
        }

        // if (windowInstance?.tronWeb) {
        //     const tronWeb = windowInstance.tronWeb;


        const tokenSaleContract = await tronWeb.contract(contracts?.tokenSaleABI, contracts?.tokenSaleAddress);

        const amountInSun = tronWeb.toSun(amount, 6);

        const tx = await tokenSaleContract.buyTokens(amountInSun, referer).send({ from: address });
        const previousSold = state?.wallet?.tokenSold;
        const newSold: any = previousSold + Number(amount);
        store.dispatch(setTokenSold(newSold))
        showNotification(`Bought ${amount} tokens`, "success")
        return tx;
        // } else {
        //     showNotification("TronLink not installed", "error")
        //     return null;
        // }
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const contactUs = async (name: string, email: string, address: string, balance: number) => {
    try {
        const url = `${baseUrl}users/createUserData`

        const data = {
            name,
            email,
            walletAddress: address,
            tokenBought: balance
        }

        const response = await axios.post(url, data)

        return response.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const isUserExist = async (address: string) => {
    try {
        const url = `${baseUrl}users/isUserExist/${address}`

        const response = await axios.get(url)

        return response.data
    }
    catch (err) {
        console.log(err)
        throw err
    }
}
