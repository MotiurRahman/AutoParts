// lib/api.ts
import axios from "axios";
import { getToken } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({ baseURL }); // authenticated
export const publicApi = axios.create({ baseURL }); // no auth header

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
