import React from "react";
import ReactDOM from "react-dom";
import Route from "./route.js";
import "./styles/app.scss";
import "react-day-picker/lib/style.css";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div>
          <Route />
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
