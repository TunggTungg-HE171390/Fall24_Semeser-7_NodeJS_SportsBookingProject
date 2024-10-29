import axios from "axios";

let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: 5 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 5;

// Có thể truy cập với Cookies
// authorizedAxiosInstance.defaults.withCredentials = true;

// Cấu hình interceptors:

//Add a request interceptor
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptors
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response?.status !== 410) {
      // Do something with response error
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
