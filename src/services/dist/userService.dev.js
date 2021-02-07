"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpService = _interopRequireDefault(require("./httpService"));

var _authService = _interopRequireDefault(require("./authService"));

var _http = require("../config/http.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiEndpoint = _http.apiUrl + "/users";

function register(user) {
  var userRes;
  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_httpService["default"].post(apiEndpoint, user));

        case 2:
          userRes = _context.sent;

          _authService["default"].loginWithJwt(userRes.headers["x-auth-token"]);

          return _context.abrupt("return", userRes.data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

var _default = {
  register: register
};
exports["default"] = _default;