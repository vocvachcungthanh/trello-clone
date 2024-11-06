import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty } from "lodash";

import { generatePlaceholderCard } from "~/utils/formatters";
import { mapOrder } from "~/utils/sorts.js";

import { API_ROOT } from "~/utils/constants";

// Khởi tạo giá trị  State của một Slice trong redux
const initialState = {
  currentActiveBoard: null,
};

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk
// đi kèm với extraReducers

export const fetchBoardDetailAPI = createAsyncThunk(
  "activeBoard/fetchBoardDetailAPI",
  async (boardId) => {
    const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);

    return res.data || [];
  }
);

// Khới tạo một cái slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: "activeBoard",
  initialState,

  // Reducers nơi sử lý dữ liệu đồng bộ
  reducers: {
    // lưu ý ở đây luôn luôn cần cặp ngoặc nhọn cho function trong reducer cho dù code bên trong
    // chỉ có 1 dòng, đây lả rule của Redux
    // https://redux-toolkit.js.org/usage/immer-reducers#mutating-and-returning-state
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến
      // có nghĩa hơn
      const board = action.payload;

      // Xử lý dữ liệu nếu cần thiết ...

      // Update lại dữ liệu của cái currentActiveBoard

      state.currentActiveBoard = board;
    },
  },

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailAPI.fulfilled, (state, action) => {
      // action.payload chính là cái response.data trả về ở trên
      let board = action.payload;

      board.columns = mapOrder(board?.columns, board?.columnOrderIds, "_id");

      board.columns.forEach((column) => {
        // Keo tha vao 1 column Rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");
        }
      });

      // Cập nhật lại dữ liệu của currentActiveBoard
      state.currentActiveBoard = board;
    });
  },
});

// Actions: Là nớ dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
// thông qua reducer (Chạy đồng bộ)
// Để ý ở trên thì không thấy properties actions đâu cả, bới vì những cái actions này đơn giản là được
// thằng redux tạo tự động theo tên của reducer nhé.
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

// Selectors: là nơ dành cho các components bến dưới gọi băng hook useSelector() để lấy dữ liệu từ trong kho store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};
// export default activeBoardSlice.reducer

export const activeBoardReducer = activeBoardSlice.reducer;
