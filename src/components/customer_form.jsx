import React, { Component } from "react";
import Joi from "joi";
import customerService from "../services/customerService";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";
import Select from "react-select";
import $ from "jquery";
import "./css/common.css";

class CustomerForm extends Component {
  state = {
    customerObj: {
      name: "",
      phone: "",
      isGold: false,
    },
    errors: {},
  };

  schemaData = {
    name: Joi.string().required().label("Name"),
    phone: Joi.string().min(10).max(10).required().label("Phone"),
    isGold: Joi.boolean().required().label("IsGold"),
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
    const customer = { ...this.state.customerObj };
    const { name, value } = input;
    customer[name] = value;
    const errors = {};
    const { error } = this.validateProperty(name, value);
    errors[name] = error ? error.details[0].message : null;
    this.setState({ customerObj: customer, errors });
  };

  handleChange = ({ value, label }) => {
    const customer = { ...this.state.customerObj };
    customer["isGold"] = value;
    this.setState({ customerObj: customer });
  };

  handleSaveCustomer = async (event) => {
    event.preventDefault();
    const { error } = this.validate(this.schema, this.state.customerObj);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    const customer = this.state.customerObj;
    try {
      await customerService.saveCustomer(customer);
      $.confirm({
        title: "Created a Customer!",
        content: "",
        type: "green",
        icon: "fa fa-folder-o",
        typeAnimated: true,
        buttons: {
          close: function () {
            window.location = "/";
          },
        },
      });
    } catch (ex) {
      $.confirm({
        title: "Error occured!",
        content: "",
        type: "red",
        icon: "fa fa-folder-o",
        typeAnimated: true,
        buttons: {
          close: function () {
            window.location = "/";
          },
        },
      });
      console.log("error", ex);
    }
  };

  render() {
    const { name, phone, isGold } = this.state.customerObj;
    const { name: name_err, phone: phone_err } = this.state.errors;

    const options = [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ];

    return (
      <div className="container mt-100">
        <form>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="name"
              value={name}
            />
            {name_err && <div className="alert alert-danger">{name_err}</div>}
          </div>
          <div className="form-group">
            <label>Customer Phone</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="phone"
              value={phone}
            />
            {phone_err && <div className="alert alert-danger">{phone_err}</div>}
          </div>
          <div className="form-group">
            <label>Is Customer Gold member?</label>
            <Select
              onChange={this.handleChange}
              value={isGold}
              options={options}
            />
          </div>
          <button
            onClick={this.handleSaveCustomer}
            className="btn btn-primary btn-sm"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default CustomerForm;
