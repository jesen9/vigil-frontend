import axios from "axios";
import { getToken } from "../utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const loginApi = async (loginData) => {
  return await api.post("users/login", loginData);
};

const getBalance = async () => {
  const token = await getToken("token");
  return await api.get("/homes/balance", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getActionsToDo = async () => {
  const token = await getToken("token");
  return await api.get("/homes/actions-todo", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getInvoiceSummary = async () => {
  const token = await getToken("token");
  return await api.get("/homes/invoice-summary", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getPaymentSummary = async () => {
  const token = await getToken("token");
  return await api.get("/homes/payment-summary", {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getItemList = async (params) => {
  const token = await getToken("token");
  return await api.get("/invoices/items", {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const submitItem = async (payload) => {
  const token = await getToken("token");
  return await api.post("/invoices/items", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getCustomerDetail = async (id) => {
  const token = await getToken("token");
  return await api.get(`/invoices/customers/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getCustomerList = async (params) => {
  const token = await getToken("token");
  return await api.get("/invoices/customers", {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const getCustomerSlimList = async (params) => {
  const token = await getToken("token");
  return await api.get("/invoices/customers/slim", {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const createCustomer = async (payload) => {
  const token = await getToken("token");
  return await api.post("/invoices/customers", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const submitInvoice = async (payload) => {
  const token = await getToken("token");
  return await api.post("/invoices/bill", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getInvoiceList = async (params) => {
  const token = await getToken("token");
  return await api.get("/invoices/bill", {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const getInvoiceDetail = async (id) => {
  const token = await getToken("token");
  return await api.get(`/invoices/bill/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const editInvoice = async (payload) => {
  const token = await getToken("token");
  return await api.put(`/invoices/bill/`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const deleteInvoice = async (id) => {
  const token = await getToken("token");
  return await api.delete(`/invoices/bill/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const addManualPayment = async (payload) => {
  const token = await getToken("token");
  return await api.post(`/payments/add-manual-payment`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getAccountManagerList = async (params) => {
  const token = await getToken("token");
  return await api.get(`/users/account-managers/slim`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const updateCompanyAddress = async (payload) => {
  const token = await getToken("token");
  return await api.post(`/users/update-address`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const meDetail = async () => {
  const token = await getToken("token");
  return await api.get(`/users/me`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getInvoiceDetailReference = async (reference) => {
  const token = await getToken("token");
  return await api.get(`/invoices/bill-public/${reference}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const createNewItem = async (payload) => {
  const token = await getToken("token");
  return await api.post("/invoices/items", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const getWorkflowList = async (params) => {
  const token = await getToken("token");
  return await api.get("/workflows/main", {
    headers: {
      Authorization: `JWT ${token}`,
    },
    params,
  });
};

const getWorkflowDetail = async (id) => {
  const token = await getToken("token");
  return await api.get(`/workflows/main/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const deleteWorkflow = async (id) => {
  const token = await getToken("token");
  return await api.delete(`/workflows/main/${id}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const createWorkflow = async (payload) => {
  const token = await getToken("token");
  return await api.post("/workflows/main", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const createWorkflowAction = async (payload) => {
  const token = await getToken("token");
  return await api.post("/workflows/workflow-action", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const editWorkflowAction = async (payload, id) => {
  const token = await getToken("token");
  return await api.put(`/workflows/workflow-action/${id}`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const editWorkflow = async (payload, id) => {
  const token = await getToken("token");
  return await api.put(`/workflows/main/${id}`, payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

const editBillingTemplate = async (payload) => {
  const token = await getToken("token");
  return await api.post("/workflows/billing-template", payload, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
};

export default {
  loginApi,
  getBalance,
  getActionsToDo,
  getInvoiceSummary,
  getPaymentSummary,
  getItemList,
  submitItem,
  getCustomerDetail,
  getCustomerList,
  getCustomerSlimList,
  submitInvoice,
  createCustomer,
  getInvoiceList,
  getInvoiceDetail,
  editInvoice,
  deleteInvoice,
  addManualPayment,
  getAccountManagerList,
  updateCompanyAddress,
  meDetail,
  getInvoiceDetailReference,
  createNewItem,
  getWorkflowList,
  deleteWorkflow,
  getWorkflowDetail,
  createWorkflow,
  editBillingTemplate,
  editWorkflow,
  createWorkflowAction,
  editWorkflowAction,
};
