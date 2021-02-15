import React, { Component } from "react";
import Joi from "joi";
import genreService from "../services/genreService";
import Pagination from "./common/pagination";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import $ from "jquery";
import CoverImg from "../assests/images/cover_new_genre.jpg";
import "jquery-confirm/dist/jquery-confirm.min.css";
import "jquery-confirm/dist/jquery-confirm.min.js";
import "font-awesome/css/font-awesome.min.css";
import "./css/common.css";

class GenreForm extends Component {
  state = {
    genreObj: {
      name: "",
    },
    errors: {},
    pageSize: 4,
    currentPage: 1,
    genres: [],
  };

  abortController = new AbortController();

  async componentDidMount() {
    try {
      const { data: genres } = await genreService.getGenres(
        this.abortController
      );
      this.setState({
        genres,
      });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

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

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleDeleteGenre = async (id, name) => {
    const { data: genreUsage } = await genreService.checkGenreUsage(id, name);
    if (genreUsage)
      $.alert({
        title: "Alert!",
        content: "This genere in use, you can update instead of deleting",
      });
    else {
      var answer = window.confirm("Are you sure you want to delete?");
      if (answer) {
        try {
          const { data: genre } = await genreService.deleteGenre(id);
          const genreList = [...this.state.genres];
          const genres = genreList.filter((g) => g._id !== genre._id);
          this.setState({ genres });
          $.alert({
            title: "Genre Deleted!",
            content: "",
            type: "green",
          });
        } catch (ex) {
          $.alert({
            title: "Something went wrong!",
            type: "red",
            content: ex,
          });
        }
      }
    }
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
            window.location = "/genre";
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
            window.location = "/genre";
          },
        },
      });
      console.log("error", ex);
    }
  };

  render() {
    const { name } = this.state.genreObj;
    const { name: name_err } = this.state.errors;
    const { pageSize, currentPage, genres } = this.state;
    const { user } = this.props;
    const pagintedgenres = paginate(genres, currentPage, pageSize);

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
          <form style={{ fontSize: 20, fontWeight: 640, height: 50 }}>
            <div className="form-group">
              <label>Genre Name</label>
              <input
                onChange={this.handleOnChange}
                type="text"
                className="form-control"
                style={{ fontSize: 20, fontWeight: 640, opacity: 0.8 }}
                name="name"
                value={name}
              />
              {name_err && <div className="alert alert-danger">{name_err}</div>}
            </div>
            <button
              onClick={this.handleSaveGenre}
              className="btn btn-primary btn"
              style={{ fontSize: 23, fontWeight: 640 }}
            >
              Save
            </button>
          </form>
        </div>
        <div className="col-md-9" style={{ paddingLeft: 600 }}>
          <table
            className="table"
            style={{
              border: "hidden",
            }}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    fontSize: 21,
                  }}
                >
                  #Id
                </th>
                <th
                  scope="col"
                  style={{
                    fontSize: 21,
                  }}
                >
                  Genre
                </th>
                <th
                  scope="col"
                  style={{
                    fontSize: 21,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pagintedgenres.map((genre) => {
                return (
                  <tr
                    key={genre._id}
                    style={{
                      border: "hidden",
                    }}
                  >
                    <td
                      style={{
                        color: "#fff",
                        fontWeight: 640,
                        textDecoration: "none",
                        fontSize: 19,
                      }}
                    >
                      {genre._id}
                    </td>
                    <td
                      style={{
                        color: "#fff",
                        fontWeight: 640,
                        textDecoration: "none",
                        fontSize: 19,
                      }}
                    >
                      {genre.name}
                    </td>
                    <td>
                      {user ? (
                        <Link
                          to="/genre"
                          onClick={() =>
                            this.handleDeleteGenre(genre._id, genre.name)
                          }
                          className="btn btn btn-danger"
                          style={{ fontSize: 17, fontWeight: 640 }}
                        >
                          Delete
                        </Link>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            itemCount={genres.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default GenreForm;
