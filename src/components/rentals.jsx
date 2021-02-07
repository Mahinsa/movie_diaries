import React, { Component } from "react";
import Pagination from "./common/pagination";
import rentalService from "../services/rentalService";
import { paginate } from "./utils/paginate";
import { Link } from "react-router-dom";
import "./css/common.css";

class Rentals extends Component {
  state = {
    pageSize: 4,
    currentPage: 1,
    rentals: [],
  };

  async componentDidMount() {
    try {
      const { data: rentals } = await rentalService.getRentals();
      this.setState({
        rentals,
      });
    } catch (ex) {
      console.log("error", ex);
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

//   handleDeleteGenre = async (id, name) => {
//     var answer = window.confirm("Are you sure you want to delete?");
//     if (answer) {
//       var genreUsage = await genreService.checkGenreUsage(id, name);
//       if (!genreUsage) {
//         try {
//           const { data: genre } = await genreService.deleteGenre(id);
//           const genreList = [...this.state.genres];
//           const genres = genreList.filter((g) => g._id !== genre._id);
//           this.setState({ genres });
//         } catch (ex) {
//           console.log("error", ex);
//         }
//       } else if (genreUsage)
//         alert("This genere in use, you can update instead of deleting");
//     }
//   };

  render() {
    const { pageSize, currentPage, rentals } = this.state;
    const pagintedrentals = paginate(rentals, currentPage, pageSize);
    return (
      <div className="row">
        <div className="col-md-9 mt-100" style={{ paddingLeft: 200, marginLeft:150 }}>
          <table className="table mt-20">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Customer</th>
                <th scope="col">Movie</th>
                <th scope="col">DateOut</th>
                <th scope="col">DateReturned</th>
                <th scope="col">RentalFee</th>
              </tr>
            </thead>
            <tbody>
              {pagintedrentals.map((rental) => {
                return (
                  <tr key={rental._id}>
                    <td>{rental._id}</td>
                    <td>{rental.customer.name}</td>
                    <td>{rental.movie.title}</td>
                    <td>{rental.dateOut}</td>
                    <td>{rental.dateReturned}</td>
                    <td>{rental.rentalFee}</td>
                    {/* <td>
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
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            itemCount={rentals.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Rentals;
