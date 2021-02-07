import http from "./httpService";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/customers";

// function movieUrl(id) {
//   return `${apiEndpoint}/${id}`;
// }

function getCustomers() {
  return http.get(apiEndpoint);
}

// function getMovie(movieId) {
//   return http.get(movieUrl(movieId));
// }

function saveCustomer(customer) {
  return http.post(apiEndpoint, customer);
}

// function updateMovie(movieId, movie) {
//   return http.put(movieUrl(movieId), movie);
// }

// function deleteMovie(movieId) {
//   return http.delete(movieUrl(movieId));
// }

export default {
  getCustomers,
  saveCustomer,
};
