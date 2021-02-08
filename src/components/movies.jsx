import React, { Component } from "react";
import Pagination from "./common/pagination";
import Genres from "../components/genres";
import movieService from "../services/movieService";
import genreService from "../services/genreService";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
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
      <div className="row">
        <div className="col-md-3 mt-100" style={{ paddingLeft: 250 }}>
          <Genres
            genres={genres}
            currentGenre={selectedGenre}
            onGenreSelect={this.handleGenreSelect}
          />
          {user ? (
            <Link to="/movie/new" className="btn btn-info btn-sm newMovieBtn">
              New Movie
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link to="/genre" className="btn btn-secondary btn-sm newGenreBtn">
              New Genre
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link
              to="/rental_form"
              className="btn btn-success btn-sm newGenreBtn"
            >
              New Rental
            </Link>
          ) : (
            ""
          )}
          {user ? (
            <Link to="/customers" className="btn btn-dark btn-sm newGenreBtn">
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
          <table className="table mt-20">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Genre</th>
                <th scope="col">Number In Stock</th>
                <th scope="col">Daily Rental Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pagintedMovies.map((movie) => {
                return (
                  <tr key={movie._id}>
                    <td>
                      {user ? (
                        <Link to={`/movie/${movie._id}`}>{movie.title}</Link>
                      ) : (
                        movie.title
                      )}
                    </td>
                    <td>{movie.genre.name}</td>
                    <td>{movie.numberInStock}</td>
                    <td>{movie.dailyRentalRate}</td>
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
