import React, { Component } from "react";
import Joi from "joi";
import $ from "jquery";
import { Redirect } from "react-router-dom";
import authService from "../../services/authService";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";
import "../css/common.css";

class LoginForm extends Component {
  state = {
    userObj: {
      email: "",
      password: "",
    },
    errors: {},
  };

  schemaData = {
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.required(),
  };

  schema = Joi.object(this.schemaData);

  validate(schema, data) {
    return schema.validate(data, {
      abortEarly: false,
    });
  }

  validateProperty(name, value) {
    const obj = { [name]: value };
    const schema = Joi.object({
      [name]: this.schemaData[name],
    });
    return schema.validate(obj);
  }

  handleOnChange = ({ target: input }) => {
    const user = { ...this.state.userObj };
    const { name, value } = input;
    user[name] = value;
    const errors = {};
    const { error } = this.validateProperty(name, value);
    errors[name] = error ? error.details[0].message : null;
    this.setState({ userObj: user, errors });
  };

  handleAuthUser = async (event) => {
    event.preventDefault();
    const { error } = this.validate(this.schema, this.state.userObj);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    try {
      const user = await authService.login(this.state.userObj);
      const { state } = this.props.location;
      
      $.confirm({
        title: "You are in!",
        content: "Logged as: " + user.name,
        type: "green",
        icon: "fa fa-smile-o",
        typeAnimated: true,
        buttons: {
          close: function () {
            window.location = state ? state.from.pathname : "/";
          },
        },
      });
    } catch (error) {
      $.confirm({
        title: "Logging error!",
        content: error.response && error.response.data,
        type: "red",
        icon: "fa fa-frown-o",
        typeAnimated: true,
        buttons: {
          close: function () {},
        },
      });
    }
  };
  render() {
    const { email: email_val, password: password_val } = this.state.userObj;
    const { email, password } = this.state.errors;
    if (authService.getCurrentUser()) return <Redirect to="/" />;
    return (
      <div className="container mt-100">
        <form>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              onChange={this.handleOnChange}
              name="email"
              value={email_val}
            />
            {email && <div className="alert alert-danger">{email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              onChange={this.handleOnChange}
              name="password"
              value={password_val}
            />
            {password && <div className="alert alert-danger">{password}</div>}
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.handleAuthUser}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
