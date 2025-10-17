// utils/apiConfig.js
import * as dotenv from "dotenv";
dotenv.config();

export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// GCC web API
const API_URLS = {
  //Login API
  LoginAPI: `${API_URL}/auth/login`,
  RegisterAPI: `${API_URL}/auth/register`,

  PartsAPI: `${API_URL}/parts`,
};

export default API_URLS;
