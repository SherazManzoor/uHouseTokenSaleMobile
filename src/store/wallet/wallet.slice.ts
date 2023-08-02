import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    usdtBalance: 0,
    tokenBalance: 0,
    tokenAllowance: 0,
    exchangeRate: 0,
    totalSupply: 0,
    tokenSold: 0,
    referralReward: 0,
    tokenToSale: 0,
    isUserDataExists: false,
}

export const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setUsdtBalance: (state: any, action: any) => {
            state.usdtBalance = action.payload
        },
        setTokenBalance: (state: any, action: any) => {
            state.tokenBalance = action.payload
        },
        setTokenAllowance: (state: any, action: any) => {
            state.tokenAllowance = action.payload
        },
        setExchangeRate: (state: any, action: any) => {
            state.exchangeRate = action.payload
        },
        setTotalSupply: (state: any, action: any) => {
            state.totalSupply = action.payload
        },
        setTokenSold: (state: any, action: any) => {
            state.tokenSold = action.payload
        },
        setReferralReward: (state: any, action: any) => {
            state.referralReward = action.payload
        },
        setTokenToSale: (state: any, action: any) => {
            state.tokenToSale = action.payload
        },
        setUserDataExists: (state: any, action: any) => {
            state.isUserDataExists = action.payload
        },
    },
});

export const {
    setUsdtBalance,
    setTokenBalance,
    setTokenAllowance,
    setExchangeRate,
    setTotalSupply,
    setTokenSold,
    setReferralReward,
    setTokenToSale,
    setUserDataExists,
} = walletSlice.actions;

export default walletSlice.reducer;