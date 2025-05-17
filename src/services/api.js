import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8082/api", // Local API URL
  headers: { "Content-Type": "application/json" }
});

export default api;