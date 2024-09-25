import React, { Component } from "react";
import { Navigate } from "react-router-dom";

class Login extends Component {
  state = {
    email: '',
    password: '',
    redirectToSignup: false,
    redirectToDashboard: false,
  };

  componentDidMount() {
    // Check if the user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, you can verify the token with the server
      this.setState({ redirectToDashboard: true });
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.status === 401) {
          // User not found or invalid credentials
          this.setState({ redirectToSignup: true });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.token) {
          localStorage.setItem("token", data.token);
          // Redirect to dashboard
          this.setState({ redirectToDashboard: true });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  render() {
    if (this.state.redirectToSignup) {
      return <Navigate to="/signup" />; // Redirect to signup page
    }
    if (this.state.redirectToDashboard) {
      return <Navigate to="/dashboard" />;
    }

    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

export default Login;
