import http from "./httpService";
import auth from "./authService";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/users";

async function register(user) {
  const userRes = await http.post(apiEndpoint, user);
  auth.loginWithJwt(userRes.headers["x-auth-token"]);
  return userRes.data;
}

export default {
  register,
};
