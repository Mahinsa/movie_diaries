import React, { Component } from "react";
import Pagination from "./common/pagination";
import genreService from "../services/genreService";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import "./css/common.css";

class GenreSettings extends Component {
  state = {
    pageSize: 4,
    currentPage: 1,
    genres: [],
  };

  async componentDidMount() {
    try {
      const { data: genres } = await genreService.getGenres();
      this.setState({
        genres,
      });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleDeleteGenre = async (id, name) => {
    var answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      var genreUsage = await genreService.checkGenreUsage(id, name);
      if (!genreUsage) {
        try {
          const { data: genre } = await genreService.deleteGenre(id);
          const genreList = [...this.state.genres];
          const genres = genreList.filter((g) => g._id !== genre._id);
          this.setState({ genres });
        } catch (ex) {
          console.log("error", ex);
        }
      } else if (genreUsage)
        alert("This genere in use, you can update instead of deleting");
    }
  };

  render() {
    const { pageSize, currentPage, genres } = this.state;
    const { user } = this.props;
    const pagintedgenres = paginate(genres, currentPage, pageSize);
    return (
      <div className="row">
        <div className="col-md-9 mt-100" style={{ paddingLeft: 600 }}>
          <table className="table mt-20">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Genre</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagintedgenres.map((genre) => {
                return (
                  <tr key={genre._id}>
                    <td>{genre._id}</td>
                    <td>{genre.name}</td>
                    <td>
                      {user ? (
                        <Link
                          to=""
                          onClick={() =>
                            this.handleDeleteGenre(genre._id, genre.name)
                          }
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

export default GenreSettings;
