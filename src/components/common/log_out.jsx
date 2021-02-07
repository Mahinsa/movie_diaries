import { Component } from "react";
import authService from "../../services/authService";

class LogOut extends Component {
  state = {};

  componentDidMount() {
    authService.logout();
    window.location = "/";
  }
  render() {
    return null;
  }
}

export default LogOut;
