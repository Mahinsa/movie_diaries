import http from "./httpService";
import { apiUrl } from "../config/http.json";

const apiEndpoint = apiUrl + "/genres";

function genreUrl(name) {
  return `${apiEndpoint}/findByName/${name}`;
}

function genreUrlId(id) {
  return `${apiEndpoint}/${id}`;
}

function genreDeleteUrl(id) {
  return `${apiEndpoint}/${id}`;
}

function checkGenreUsageUrl(id, name) {
  return `${apiEndpoint}/checkUsage/${id}/${name}`;
}

function getGenres() {
  return http.get(apiEndpoint);
}

function getGenre(genreId) {
  return http.get(genreUrlId(genreId));
}

function getGenresByName(genreName) {
  return http.get(genreUrl(genreName));
}

function checkGenreUsage(genreId, genreName) {
  return http.get(checkGenreUsageUrl(genreId, genreName));
}

function addGenre(genre) {
  return http.post(apiEndpoint, genre);
}

function deleteGenre(genreId) {
  return http.delete(genreDeleteUrl(genreId));
}

export default {
  getGenre,
  getGenres,
  getGenresByName,
  checkGenreUsage,
  addGenre,
  deleteGenre,
};
