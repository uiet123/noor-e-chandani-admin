import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';
import adminReducer from "./adminSlice"

const store = configureStore({
    reducer: {
        orders: orderReducer,
        admin: adminReducer
    },
});
export default store;