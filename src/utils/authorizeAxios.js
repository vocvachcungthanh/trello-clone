import axios from "axios";
import { toast } from "react-toastify";
import { interceptorLoadingElements } from "./formatters";
import { refreshTokenAPI } from "~/apis";
import { logoutUserAPI } from "~/redux/user/userSlice";

/**
 * Không thể import (store) trong '~/redux/store' theo cách thông thường ở đây
 * Giả pháp: Inject store: là kỹ thuật khi cần sử dụng redux store ở các file ngoài phạm vi component
 * như authorizeAxios hiện tại
 * Hiển đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chay vào main.jsx đầu tiên. từ bên đó chúng ta gọi ham injectStore ngay lập tức để ngan biên mainStore và biên axiosReduxStore cụ bộ trong file này
 *
 */
let axiosReduxStore;

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore;
};

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

let refreshTokenPromise = null;

// Interceptors Response: Can thiệp vào giữa những cái response nhân về
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Kỹ thuật chặn spam click (Xem mô tả kỹ ở file formatters chứa function)
    interceptorLoadingElements(true);

    return response;
  },
  (error) => {
    // Mọi mã http status code năm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (Viết code một lần: Clean code)
    // console.log error ra sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây

    // Kỹ thuật chặn spam click (Xem mô tả kỹ ở file formatters chứa function)
    interceptorLoadingElements(false);

    /**
     * Quan trọng: Xử lý Refresh Token tự động
     */

    //Trường hợp 1: Nếu như nhập mã 401 từ BE, thì gọi api đăng xuất luôn

    if (error.response?.status === 401) {
      axiosReduxStore.dispatch(logoutUserAPI(false));
    }

    //Trường 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
    //Đầu tiên lấy được các request API đã bị lỗi thông qua error.config
    const originalRequests = error.config;

    if (error.response.status === 410 && !originalRequests._retry) {
      // Gán thêm một giá trị _retry luôn = true trong quá khoảng thời gian chơ, đảm bảo việc refresh token này
      // Chỉ luôn gọi 1 lần tại 1 thời điểm (Nhìn lại điều kiện if ngay phía trên)
      originalRequests._retry = true;

      // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việt gọi api refresh_token đồng thời
      // gán vào cho cái refreshTokenPromist

      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đồng thời accessToken đã năm trong httpOnly cookie (Xửu lý từ phía BE)
            return data?.accessToken;
          })
          .catch((_error) => {
            // Nếu nhận bất ký lỗi nào từ phía api resfreshToken thì cứ logout luôn
            axiosReduxStore.dispatch(logoutUserAPI(false));
            return Promise.reject(_error);
          })
          .finally(() => {
            //Dù API Có thành công hay lỗi thì vẫn luôn gán lại refreshTokenPromise về null như ban đầu
            refreshTokenPromise = null;
          });
      }

      //Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây
      //eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        /**
         * Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết
         * thêm code xử lý ở đây
         * Hiện tại ở đây không cần xử lý bước này vì chúng ta đã đưa accessToken vào cookie (Xử lý từ phía BE)
         * sau khi api refreshToken được gọi thành công.
         */

        /**
         * Bước 2: Bước quan trọng return lại axios instance của chúng ta kết hợp các originalRequests để
         * gọi lại những api ban đầu bị lỗi
         */
        return authorizeAxiosInstance(originalRequests);
      });
    }

    // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đấy (Viết code một lần: Clean Code)

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
