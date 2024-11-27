// Redux:: store state tool
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { activeBoardReducer } from "./activeBoard/activeBoardSlice";
import { userReducer } from "./user/userSlice";

const rootPersistConfig = {
  key: "root", // key của persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biên storage ở trên - lưu vào localstorage
  whitelist: ["user"], // Định nghĩa các slice dữ liệu được phép duy trì qua mỗi lần f5 của trình duyệt
  // backlist: ['user'] // định nghĩa các slice không được duy trì qua mỗi lần f5 trình duyệt
};

// Combine các reducer trong dự án của chung ta ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
});

// Thực hiện persistReducer
const persistReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistReducers,

  //fix warring error when implement redux-persist

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
