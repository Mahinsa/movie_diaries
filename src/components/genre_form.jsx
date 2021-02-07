import React, { Component } from "react";
import Joi from "joi";
import genreService from "../services/genreService";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";
import $ from "jquery";
import "./css/common.css";

class GenreForm extends Component {
  state = {
    genreObj: {
      name: "",
    },
    errors: {},
  };

  schemaData = {
    name: Joi.string().required().label("Name"),
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
    const genre = { ...this.state.genreObj };
    const { name, value } = input;
    genre[name] = value;
    const errors = {};
    const { error } = this.validateProperty(name, value);
    errors[name] = error ? error.details[0].message : null;
    this.setState({ genreObj: genre, errors });
  };

  handleSaveGenre = async (event) => {
    event.preventDefault();
    const { error } = this.validate(this.schema, this.state.genreObj);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    const genre = this.state.genreObj;
    try {
      await genreService.addGenre(genre);
      $.confirm({
        title: "Created a Genre!",
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
    const { name } = this.state.genreObj;
    const { name: name_err } = this.state.errors;

    return (
      <div className="container mt-100">
        <form>
          <div className="form-group">
            <label>Genre Name</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="name"
              value={name}
            />
            {name_err && <div className="alert alert-danger">{name_err}</div>}
          </div>
          <button
            onClick={this.handleSaveGenre}
            className="btn btn-primary btn-sm"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default GenreForm;
