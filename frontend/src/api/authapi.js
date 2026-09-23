import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ email, token, new_password }) => {
  const response = await api.post("/auth/reset-password", {
    email,
    token,
    new_password,
  });
  return response.data;
};

export const updateProfile = async ({ user_id, name, email }) => {
  const response = await api.put("/auth/profile", {
    user_id,
    name,
    email,
  });
  return response.data;
};

export const changePassword = async ({ user_id, current_password, new_password }) => {
  const response = await api.put("/auth/change-password", {
    user_id,
    current_password,
    new_password,
  });
  return response.data;
};

export const verifyEmail = async ({ email, code }) => {
  const response = await api.post("/auth/verify-email", { email, code });
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await api.post("/auth/resend-verification", { email });
  return response.data;
};

