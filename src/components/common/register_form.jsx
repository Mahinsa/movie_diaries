import React, { Component } from "react";
import "../css/common.css";
import Joi from "joi";
import $ from "jquery";
import userService from "../../services/userService";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";

class RegisterForm extends Component {
  state = {
    userObj: {
      name: "",
      email: "",
      password: "",
    },
    errors: {},
  };

  schemaData = {
    name: Joi.string().required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(8).required(),
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

  handleSaveUser = async (event) => {
    event.preventDefault();
    const { error } = this.validate(this.schema, this.state.userObj);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    try {
      const user = await userService.register(this.state.userObj);
      $.confirm({
        title: "Created an Account!",
        content: "Name: " + user.name + "<br />" + "email: " + user.email,
        type: "green",
        icon: "fa fa-smile-o",
        typeAnimated: true,
        buttons: {
          close: function () {
            window.location = "/";
          },
        },
      });
    } catch (error) {
      $.confirm({
        title: "Encountered an error!",
        content: error.response.data,
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
    const {
      name: name_val,
      email: email_val,
      password: password_val,
    } = this.state.userObj;
    const { name, email, password } = this.state.errors;
    return (
      <div className="container mt-100">
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              onChange={this.handleOnChange}
              name="name"
              value={name_val}
            />
            {name && <div className="alert alert-danger">{name}</div>}
          </div>
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
          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" />
            <label className="form-check-label">Check me out</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.handleSaveUser}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
