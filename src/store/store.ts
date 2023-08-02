
import { configureStore } from '@reduxjs/toolkit'
import WalletReducer from './wallet/wallet.slice'

// import rootReducer from './reducers'

export const store = configureStore({
    reducer: {
        wallet: WalletReducer,
    }
})