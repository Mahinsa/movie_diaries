import React, { Component } from "react";
import Joi from "joi";
import genreService from "../services/genreService";
import movieService from "../services/movieService";
import Select from "react-select";
import "./css/common.css";

class MovieForm extends Component {
  state = {
    movieObj: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    errors: {},
    options: [],
    selectedValuePlaceholder: "select",
  };

  abortController = new AbortController();

  schemaData = {
    title: Joi.string().min(5).max(50).required().label("Title"),
    genreId: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().required().label("Number In Stock"),
    dailyRentalRate: Joi.number().required().label("Daily Rental Rate"),
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

  async componentDidMount() {
    try {
      var options = [];
      var { movieObj } = this.state;
      const { id } = this.props.match.params;
      if (id !== "new") {
        const { data: movie } = await movieService.getMovie(id);
        movieObj = {
          title: movie.title,
          genreId: movie.genre._id,
          numberInStock: movie.numberInStock,
          dailyRentalRate: movie.dailyRentalRate,
        };
        this.setState({ movieObj });
      }

      if (movieObj.genreId !== null) {
        const { data: genre } = await genreService.getGenre(movieObj.genreId);
        this.setState({ selectedValuePlaceholder: genre.name });
      }
      const { data: genres } = await genreService.getGenres(
        this.abortController
      );

      if (genres) {
        genres.map((genre) =>
          options.push({ value: genre._id, label: genre.name })
        );
      }

      this.setState({ options });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  handleOnChange = ({ target: input }) => {
    const movie = { ...this.state.movieObj };
    const { name, value } = input;
    movie[name] = value;
    const errors = {};
    const { error } = this.validateProperty(name, value);
    errors[name] = error ? error.details[0].message : null;
    this.setState({ movieObj: movie, errors });
  };

  handleChange = ({ value, label }) => {
    const movie = { ...this.state.movieObj };

    movie["genreId"] = value;
    this.setState({ movieObj: movie, selectedValuePlaceholder: label });
  };

  handleSaveMovie = async (event) => {
    event.preventDefault();
    const movie = this.state.movieObj;
    const { error } = this.validate(this.schema, movie);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });
    try {
      await movieService.saveMovie(movie);
    } catch (ex) {
      console.log("error", ex);
    }
  };

  handleUpdateMovie = async (event) => {
    event.preventDefault();
    const movie = this.state.movieObj;
    const { error } = this.validate(this.schema, movie);

    const errors = {};
    if (error) for (let err of error.details) errors[err.path[0]] = err.message;
    this.setState({ errors });

    try {
      await movieService.updateMovie(this.props.match.params.id, movie);
    } catch (ex) {
      console.log("error", ex);
    }
  };

  render() {
    const {
      title,
      genreId,
      numberInStock,
      dailyRentalRate,
    } = this.state.movieObj;
    const { options, selectedValuePlaceholder } = this.state;
    const { id } = this.props.match.params;
    const {
      title: title_err,
      genreId: genreId_err,
      numberInStock: numberInStock_err,
      dailyRentalRate: dailyRentalRate_err,
    } = this.state.errors;

    return (
      <div className="container mt-100">
        <form>
          <div className="form-group">
            <label>Title</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="title"
              value={title}
            />
            {title_err && <div className="alert alert-danger">{title_err}</div>}
          </div>
          <div className="form-group">
            <label>Genre</label>
            <Select
              onChange={this.handleChange}
              value={genreId}
              options={options}
              placeholder={selectedValuePlaceholder}
            />
            {genreId_err && (
              <div className="alert alert-danger">{genreId_err}</div>
            )}
          </div>
          <div className="form-group">
            <label>Number In Stock</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="numberInStock"
              value={numberInStock}
            />
            {numberInStock_err && (
              <div className="alert alert-danger">{numberInStock_err}</div>
            )}
          </div>
          <div className="form-group">
            <label>Daily Rental Rate</label>
            <input
              onChange={this.handleOnChange}
              type="text"
              className="form-control"
              name="dailyRentalRate"
              value={dailyRentalRate}
            />
            {dailyRentalRate_err && (
              <div className="alert alert-danger">{dailyRentalRate_err}</div>
            )}
          </div>
          <button
            onClick={
              id === "new" ? this.handleSaveMovie : this.handleUpdateMovie
            }
            className="btn btn-primary btn-sm"
          >
            {id === "new" ? "Save" : "Update"}
          </button>
        </form>
      </div>
    );
  }
}

export default MovieForm;
