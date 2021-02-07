import http from "./httpService";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/movies";

function movieUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function getMovies() {
  return http.get(apiEndpoint);
}

function getMovie(movieId) {
  return http.get(movieUrl(movieId));
}

function saveMovie(movie) {
  return http.post(apiEndpoint, movie);
}

function updateMovie(movieId, movie) {
  return http.put(movieUrl(movieId), movie);
}

function deleteMovie(movieId) {
  return http.delete(movieUrl(movieId));
}

export default {
  getMovies,
  deleteMovie,
  saveMovie,
  updateMovie,
  getMovie,
};
