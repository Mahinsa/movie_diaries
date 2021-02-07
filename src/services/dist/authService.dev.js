"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpService = _interopRequireDefault(require("./httpService"));

var _jwtDecode = _interopRequireDefault(require("jwt-decode"));

var _http = require("../config/http.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiEndpoint = _http.apiUrl + "/auth";
var Jwt = "JwtToken";

_httpService["default"].setJwt(getJwt());

function getJwt() {
  return localStorage.getItem(Jwt);
}

function login(user) {
  var userRes;
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_httpService["default"].post(apiEndpoint, user));

        case 2:
          userRes = _context.sent;
          localStorage.setItem(Jwt, userRes.headers["x-auth-token"]);
          return _context.abrupt("return", userRes.data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function logout() {
  localStorage.removeItem(Jwt);
}

function getCurrentUser() {
  try {
    var jwt = localStorage.getItem(Jwt);
    return (0, _jwtDecode["default"])(jwt);
  } catch (ex) {
    return null;
  }
}

function loginWithJwt(jwtKey) {
  localStorage.setItem(Jwt, jwtKey);
}

var _default = {
  getJwt: getJwt,
  login: login,
  logout: logout,
  loginWithJwt: loginWithJwt,
  getCurrentUser: getCurrentUser
};
exports["default"] = _default;