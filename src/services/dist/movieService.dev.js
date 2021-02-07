"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpService = _interopRequireDefault(require("./httpService"));

var _http = require("../config/http.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiEndpoint = _http.apiUrl + "/movies";

function movieUrl(id) {
  return "".concat(apiEndpoint, "/").concat(id);
}

function getMovies() {
  return _httpService["default"].get(apiEndpoint);
}

function getMovie(movieId) {
  return _httpService["default"].get(movieUrl(movieId));
}

function saveMovie(movie) {
  return _httpService["default"].post(apiEndpoint, movie);
}

function updateMovie(movieId, movie) {
  return _httpService["default"].put(movieUrl(movieId), movie);
}

function deleteMovie(movieId) {
  return _httpService["default"]["delete"](movieUrl(movieId));
}

var _default = {
  getMovies: getMovies,
  deleteMovie: deleteMovie,
  saveMovie: saveMovie,
  updateMovie: updateMovie,
  getMovie: getMovie
};
exports["default"] = _default;