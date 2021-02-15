import React, { Component } from "react";
import Joi from "joi";
import rentalService from "../services/rentalService";
import customerService from "../services/customerService";
import movieService from "../services/movieService";
import Select from "react-select";
import $ from "jquery";
import CoverImg from "../assests/images/cover_new_genre.jpg";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";
import "./css/common.css";

class RentalForm extends Component {
  state = {
    rentalObj: {
      customerId: "",
      movieId: "",
      dateReturned: "",
      rentalFee: 0,
    },
    errors: {},
    options_customer: [],
    options_movie: [],
    selectedValuePlaceholderCustomer: "select",
    selectedValuePlaceholderMovie: "select",
  };

  abortController = new AbortController();

  async componentDidMount() {
    try {
      const { data: customers } = await customerService.getCustomers();
      const { data: movies } = await movieService.getMovies(
        this.abortController
      );
      var options_customer = [];
      var options_movie = [];

      if (customers) {
        customers.map((customer) =>
          options_customer.push({ value: customer._id, label: customer.name })
        );
      }

      if (movies) {
        movies.map((movie) =>
          options_movie.push({ value: movie._id, label: movie.title })
        );
      }

      this.setState({
        options_customer,
        options_movie,
      });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  schemaData = {
    customerId: Joi.string().required().label("customerId"),
    movieId: Joi.string().required().label("movieId"),
    dateReturned: Joi.string().label("dateReturned"),
    rentalFee: Joi.number().label("rentalFee"),
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
    const rental = { ...this.state.rentalObj };
    const { name, value } = input;
    rental[name] = value;
    const errors = {};
    const { error } = this.validateProperty(name, value);
    errors[name] = error ? error.details[0].message : null;
    this.setState({ rentalObj: rental, errors });
  };

  handleChangeCustomer = ({ value, label }) => {
    const rental = { ...this.state.rentalObj };

    rental["customerId"] = value;
    this.setState({
      rentalObj: rental,
      selectedValuePlaceholderCustomer: label,
    });
  };

  handleChangeMovie = ({ value, label }) => {
    const rental = { ...this.state.rentalObj };

    rental["movieId"] = value;
    this.setState({ rentalObj: rental, selectedValuePlaceholderMovie: label });
  };

  handleSaveRental = async (event) => {
    event.preventDefault();
    const { error } = this.validate(this.schema, this.state.rentalObj);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    const rental = this.state.rentalObj;
    try {
      await rentalService.addRental(rental);
      $.confirm({
        title: "Created a Rental!",
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
    const {
      customerId,
      movieId,
      dateReturned,
      rentalFee,
    } = this.state.rentalObj;
    const {
      options_customer,
      options_movie,
      selectedValuePlaceholderCustomer,
      selectedValuePlaceholderMovie,
    } = this.state;
    const {
      customerId: customerId_err,
      movieId: movieId_err,
      dateReturned: dateReturned_err,
      rentalFee: rentalFee_err,
    } = this.state.errors;

    return (
      <div
        className="row"
        style={{
          backgroundImage: `url(${CoverImg})`,
          backgroundSize: "cover",
          backgroundPosition: "fixed",
          height: 937,
          width: 1925,
          marginLeft: -5,
        }}
      >
        <div className="container mt-100">
          <form style={{ fontSize: 20, fontWeight: 640 }}>
            <div className="form-group">
              <label>Customer Name</label>
              <Select
                onChange={this.handleChangeCustomer}
                value={customerId}
                options={options_customer}
                placeholder={selectedValuePlaceholderCustomer}
              />
              {customerId_err && (
                <div className="alert alert-danger">{customerId_err}</div>
              )}
            </div>
            <div className="form-group">
              <label>Movie Name</label>
              <Select
                onChange={this.handleChangeMovie}
                value={movieId}
                options={options_movie}
                placeholder={selectedValuePlaceholderMovie}
              />
              {movieId_err && (
                <div className="alert alert-danger">{movieId_err}</div>
              )}
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                onChange={this.handleOnChange}
                type="date"
                className="form-control"
                style={{ fontSize: 20, fontWeight: 640 }}
                name="dateReturned"
                value={dateReturned}
              />
              {dateReturned_err && (
                <div className="alert alert-danger">{dateReturned_err}</div>
              )}
            </div>
            <div className="form-group">
              <label>Rental Fee</label>
              <input
                onChange={this.handleOnChange}
                type="text"
                className="form-control"
                style={{ fontSize: 20, fontWeight: 640 }}
                name="rentalFee"
                value={rentalFee}
              />
              {rentalFee_err && (
                <div className="alert alert-danger">{rentalFee_err}</div>
              )}
            </div>
            <button
              onClick={this.handleSaveRental}
              className="btn btn-primary btn-sm"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default RentalForm;
