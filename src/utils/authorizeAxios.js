import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";

// Khởi tạo một đối tượng Axios (authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizeAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: Se cho phép axios tự động gửi cookie trong mỗi request lên BE (Phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizeAxiosInstance.defaults.withCredentials = true;

/**
 * Cấu hình interceptors (Bộ đánh chặn vào giữa mọi request & Response)
 */

// Interceptors Request: Can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Kỹ thuật chặn spam click (Xem mô tả kỹ ở file formatters chứa function)
    interceptorLoadingElements(true);
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Interceptors Response: Can thiệp vào giữa những cái response nhân về
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click (Xem mô tả kỹ ở file formatters chứa function)
    interceptorLoadingElements(false);
    return response;
  },
  (error) => {
    // Mọi mã http status code năm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (Viết code một lần: Clean code)
    // console.log error ra sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây

    // Kỹ thuật chặn spam click (Xem mô tả kỹ ở file formatters chứa function)
    interceptorLoadingElements(true);
    let errorMessage = error?.errorMessage;

    if (error.response?.data?.message) {
      errorMessage = error.response?.data?.message;
    }

    // Dung Toastify để hiển thị bất kể mọi mã lỗi liên quan lên màn hình - Ngoại trừ mã 410 - GOME phục vụ việc tự động
    // refresh token

    if (error.response?.status !== 410) {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

export default authorizeAxiosInstance;
