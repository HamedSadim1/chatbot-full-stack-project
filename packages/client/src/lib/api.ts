import axios from "axios";
import { API } from "./constants";

export const apiClient = axios.create({
  baseURL: API.baseUrl,
});
