import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const loginApi = async (loginData) => {
  return await api.post("users/login", loginData);
};


export default {
  loginApi,
};
