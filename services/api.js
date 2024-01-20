import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL + `/api`,
  timeout: 1000000,
});



const loginApi = async (loginData) => {
  return await api.post("/login", loginData);
};

const register = async (data) => {
  return await api.post("/register", data);
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
  return await api.get(`/get-cve-list`, {
    params: requestParams,
  });
};

const getCVEDetails = async (cveId) => {
  return await api.get(
    `/get-cve-details?cveId=${cveId}`
  );
};

const getUpdateDatabase = async () => {
  return await api.get(
    `/update-database`
  );
};

const insertNotes = async (payloadNotes) => {
  const token = getToken("token") 
  return await api.post("/insert-notes?user", payloadNotes,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)};

const getNotes = async (cveId) => {
  const token = getToken("token")
  return await api.get(
    `/get-notes?cveId=${cveId}`
  ,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)};

const deleteNotes = async (id) => {
  const token = getToken("token")
  return await api.get(
    `/delete-notes/{id}`
  , {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)};

const logout = async () => {
  const token = getToken("token")
  console.log(`logout ${token}`);
  return await api.post("/logout", {},{
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)};


export default {
  register,
  deleteNotes,
  getNotes,
  insertNotes,
  getUpdateDatabase,
  loginApi,
  getCVEList,
  getCVEDetails,
  logout,
};
