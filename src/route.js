import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { SearchContextProvider } from "./url-shorten/context";
import Home from "./url-shorten/home";

function Nav() {
  return (
    <SearchContextProvider>
      <Router>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
      </Router>
    </SearchContextProvider>
  );
}

export default Nav;
