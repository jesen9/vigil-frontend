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
  return await api.post("/insert-notes", payloadNotes);
};

const getNotes = async (cveId) => {
  return await api.get(
    `/get-notes?veId=${cveId}`
  );
};

const deleteNotes = async (id) => {
  return await api.get(
    `/delete-notes/{id}`
  );
};


export default {
  register,
  deleteNotes,
  getNotes,
  insertNotes,
  getUpdateDatabase,
  loginApi,
  getCVEList,
  getCVEDetails,
};
