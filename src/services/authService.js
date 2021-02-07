import http from "./httpService";
import jwtDecode from "jwt-decode";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/auth";
const Jwt = "JwtToken";

http.setJwt(getJwt());

function getJwt() {
  return localStorage.getItem(Jwt);
}

async function login(user) {
  const userRes = await http.post(apiEndpoint, user);
  localStorage.setItem(Jwt, userRes.headers["x-auth-token"]);
  return userRes.data;
}

function logout() {
  localStorage.removeItem(Jwt);
}

function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(Jwt);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function loginWithJwt(jwtKey) {
  localStorage.setItem(Jwt, jwtKey);
}

export default {
  getJwt,
  login,
  logout,
  loginWithJwt,
  getCurrentUser,
};
