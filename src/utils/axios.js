import axios from "axios";
import { API_BASE_URL } from "./requests";

// Base URL to Make Requests to movie database
const instance = axios.create({
  baseURL: API_BASE_URL,
});

export default instance;
