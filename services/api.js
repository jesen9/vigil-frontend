import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + `/api`,
  timeout: 10000,
});

const loginApi = async (loginData) => {
  return await api.post("users/login", loginData);
};

const getCVEList = async (params, resultsPerPage, startIndex) => {
  console.log("params", params);

  // Include resultsPerPage and startIndex in the params object
  const requestParams = {
    ...params,
    resultsPerPage,
    startIndex,
  };
  console.log("requestParams", requestParams);
  return await api.get(`/getcvelist`, {
    params: requestParams,
  });
};

const getCVEDetails = async (cveId) => {
  return await api.get(
    `/getcvedetails?cveId=${cveId}`
  );
};

export default {
  loginApi,
  getCVEList,
  getCVEDetails,
};
