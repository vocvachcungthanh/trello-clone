import { toast } from "react-toastify";

import authorizeAxiosInstance from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

// Boards
// export const fetchBoardDetailAPI = async (boardId) => {
//   const res = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);

//   return res.data || [];
// };

export const updateBoardDetailAPI = async (boardId, updateData) => {
  const res = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );

  return res.data || [];
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const res = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );

  return res.data || [];
};

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const res = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/columns/`,
    newColumnData
  );

  return res.data || [];
};

export const updateColumnDetailAPI = async (columnId, updateData) => {
  const res = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );

  return res.data || [];
};

export const deleteColumnDetailAPI = async (columnId) => {
  const res = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );

  return res.data || [];
};

// Cards
export const createNewCardAPI = async (newCardData) => {
  const res = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  );

  return res.data || [];
};

// users
export const registerUserAPI = async (data) => {
  const res = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  );

  toast.success(
    "Account created successfully! please check and verify your account before logging in!",
    {
      theme: "colored",
    }
  );

  return res.data;
};

export const verifyUserAPI = async (data) => {
  const res = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  );
  toast.success(
    "Account verified successfully! Now you can login to enjoy our services! Have a good day!",
    { theme: "colored" }
  );

  return res.data;
};

export const refreshTokenAPI = async (data) => {
  const res = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`,
    data
  );

  return res.data;
};
