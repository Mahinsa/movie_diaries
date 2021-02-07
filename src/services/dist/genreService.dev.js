"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpService = _interopRequireDefault(require("./httpService"));

var _http = require("../config/http.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiEndpoint = _http.apiUrl + "/genres";

function genreUrl(name) {
  return "".concat(apiEndpoint, "/findByName/").concat(name);
}

function genreDeleteUrl(id) {
  return "".concat(apiEndpoint, "/").concat(id);
}

function checkGenreUsageUrl(id, name) {
  return "".concat(apiEndpoint, "/checkUsage/").concat(id, "/").concat(name);
}

function getGenres() {
  return _httpService["default"].get(apiEndpoint);
}

function getGenresByName(genreName) {
  return _httpService["default"].get(genreUrl(genreName));
}

function checkGenreUsage(genreId, genreName) {
  return _httpService["default"].get(checkGenreUsageUrl(genreId, genreName));
}

function addGenre(genre) {
  return _httpService["default"].post(apiEndpoint, genre);
}

function deleteGenre(genreId) {
  return _httpService["default"]["delete"](genreDeleteUrl(genreId));
}

var _default = {
  getGenres: getGenres,
  getGenresByName: getGenresByName,
  checkGenreUsage: checkGenreUsage,
  addGenre: addGenre,
  deleteGenre: deleteGenre
};
exports["default"] = _default;