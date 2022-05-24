import axios, { AxiosInstance } from "axios";

const baseURL = "http://localhost:5010/";

const setInterceptors = (api: AxiosInstance) => {
  api.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      if (error.message.includes("timeout")) {
        return Promise.reject("Timeout error");
      }
      return Promise.reject(JSON.stringify(error?.response?.data) || "Unknown error");
    }
  );
};

const API = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
setInterceptors(API);

export { API };
