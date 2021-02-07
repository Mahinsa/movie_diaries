"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function setJwt(jwt) {
  _axios["default"].defaults.headers.common["x-auth-token"] = jwt;
}

var _default = {
  get: _axios["default"].get,
  post: _axios["default"].post,
  put: _axios["default"].put,
  "delete": _axios["default"]["delete"],
  setJwt: setJwt
};
exports["default"] = _default;