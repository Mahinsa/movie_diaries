import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import authService from "./services/authService";
import NavBar from "./components/nav_bar";
import MovieForm from "./components/movie_form";
import Movies from "./components/movies";
import RegisterForm from "./components/common/register_form";
import LoginForm from "./components/common/login_form";
import LogOut from "./components/common/log_out";
import ProtectedRoute from "./components/common/protected_route";
import GenreForm from "./components/genre_form";
import Rentals from "./components/rentals";
import RentalForm from "./components/rental_form";
import CustomerForm from "./components/customer_form";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = authService.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <div>
          <NavBar user={user} />
        </div>
        <div className="content">
          <Switch>
            <ProtectedRoute path="/movie/:id" component={MovieForm} />
            <ProtectedRoute path="/customers" component={CustomerForm} />
            <ProtectedRoute path="/rentals" component={Rentals} />
            <ProtectedRoute path="/rental_form" component={RentalForm} />
            <Route path="/register" component={RegisterForm} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={LogOut} />
            <Route
              path="/genre"
              render={(props) => <GenreForm {...props} user={user} />}
            />
            <Route
              path="/"
              render={(props) => <Movies {...props} user={user} />}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
