import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

// Khởi tạo giá trị  State của một Slice trong redux
const initialState = {
  currentUser: null,
};

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk
// đi kèm với extraReducers

export const loginUserAPI = createAsyncThunk(
  "user/loginUserAPI",
  async (data) => {
    const res = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/users/login`,
      data
    );

    return res.data || [];
  }
);

export const logoutUserAPI = createAsyncThunk(
  "user/logoutUserAPI",
  async (showSuccessMessage = true) => {
    const res = await authorizeAxiosInstance.delete(
      `${API_ROOT}/v1/users/logout`
    );

    if (showSuccessMessage) {
      toast.success("Logged out successfully!");
    }

    return res.data;
  }
);

export const updateUserAPI = createAsyncThunk(
  "user/updateUserAPI",
  async (data) => {
    const res = await authorizeAxiosInstance.put(
      `${API_ROOT}/v1/users/update`,
      data
    );

    return res.data || [];
  }
);

// Khới tạo một cái slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: "user",
  initialState,

  // Reducers nơi sử lý dữ liệu đồng bộ
  reducers: {},

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null;
    });

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload;
      state.currentUser = user;
    });
  },
});

export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
