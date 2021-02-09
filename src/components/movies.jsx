import React, { Component } from "react";
import Pagination from "./common/pagination";
import Genres from "../components/genres";
import movieService from "../services/movieService";
import genreService from "../services/genreService";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import CoverImg from "../assests/images/cover7.jpg";
import "./css/common.css";

class Movies extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    selectedGenre: {
      name: "All Genres",
    },
  };

  abortController = new AbortController();

  async componentDidMount() {
    try {
      const { data: movies } = await movieService.getMovies(
        this.abortController
      );
      const { data: genres } = await genreService.getGenres(
        this.abortController
      );
      this.setState({
        movies,
        genres: [{ _id: "all_genres", name: "All Genres" }, ...genres],
      });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  handleGenreSelect = (Genre) => {
    this.setState({ selectedGenre: Genre });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleDeleteMovie = async (id) => {
    try {
      const { data: movie } = await movieService.deleteMovie(id);
      const movieList = [...this.state.movies];
      const movies = movieList.filter((m) => m._id !== movie._id);
      this.setState({ movies });
    } catch (ex) {
      console.log("error", ex);
    }
  };

  render() {
    const { movies, pageSize, currentPage, genres, selectedGenre } = this.state;
    const { user } = this.props;
    const filteredMovies =
      selectedGenre.name === "All Genres"
        ? movies
        : movies.filter((m) => m.genre.name === selectedGenre.name);
    const pagintedMovies = paginate(filteredMovies, currentPage, pageSize);
    return (
      <div
        className="row"
        style={{
          backgroundImage: `url(${CoverImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: 937,
          width: 1935,
        }}
      >
        <div className="col-md-3 mt-100" style={{ paddingLeft: 250 }}>
          <Genres
            genres={genres}
            currentGenre={selectedGenre}
            onGenreSelect={this.handleGenreSelect}
          />
          {user ? (
            <Link
              to="/movie/new"
              className="btn btn-info btn newMovieBtn"
              style={{ opacity: 0.8, fontSize: 25 }}
            >
              New Movie
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link
              to="/genre"
              className="btn btn-secondary btn newGenreBtn"
              style={{ opacity: 0.8, fontSize: 25 }}
            >
              New Genre
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link
              to="/rental_form"
              className="btn btn-success btn newGenreBtn"
              style={{ opacity: 0.8, fontSize: 25 }}
            >
              New Rental
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link
              to="/customers"
              className="btn btn-dark btn newGenreBtn"
              style={{ opacity: 0.8, fontSize: 25 }}
            >
              New Customer
            </Link>
          ) : (
            ""
          )}
        </div>
        <div
          className="col-md-9 mt-100"
          style={{ paddingRight: 250, paddingLeft: 100 }}
        >
          <table
            className="table mt-20"
            style={{
              border: "hidden",
            }}
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{
                    fontSize: 19,
                  }}
                >
                  Title
                </th>
                <th
                  scope="col"
                  style={{
                    fontSize: 19,
                  }}
                >
                  Genre
                </th>
                <th
                  scope="col"
                  style={{
                    fontSize: 19,
                  }}
                >
                  Number In Stock
                </th>
                <th
                  scope="col"
                  style={{
                    fontSize: 19,
                  }}
                >
                  Daily Rental Rate
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody
              style={{
                border: "hidden",
              }}
            >
              {pagintedMovies.map((movie) => {
                return (
                  <tr
                    key={movie._id}
                    style={{
                      border: "hidden",
                    }}
                  >
                    <td
                      style={{
                        color: "#000",
                        fontWeight: 640,
                        textDecoration: "none",
                        fontSize: 17,
                      }}
                    >
                      {user ? (
                        <Link
                          to={`/movie/${movie._id}`}
                          style={{
                            color: "#000",
                            fontWeight: 640,
                            textDecoration: "none",
                            fontSize: 17,
                          }}
                        >
                          {movie.title}
                        </Link>
                      ) : (
                        movie.title
                      )}
                    </td>
                    <td
                      style={{
                        fontWeight: 500,
                        fontSize: 17,
                      }}
                    >
                      {movie.genre.name}
                    </td>
                    <td
                      style={{
                        fontWeight: 500,
                        fontSize: 17,
                      }}
                    >
                      {movie.numberInStock}
                    </td>
                    <td
                      style={{
                        fontWeight: 500,
                        fontSize: 17,
                      }}
                    >
                      {movie.dailyRentalRate}
                    </td>
                    <td>
                      {user ? (
                        <Link
                          to=""
                          onClick={() => this.handleDeleteMovie(movie._id)}
                          className="btn btn-sm btn-danger"
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
            itemCount={filteredMovies.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
