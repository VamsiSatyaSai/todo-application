import React, { Component } from "react";
import { Navigate, Link } from "react-router-dom";
import './index.css';  // Importing component-specific CSS

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    redirect: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = this.state;

    fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data)=>{
        localStorage.setItem('token',data.token);
      this.setState({ redirect: true });
    })
      .catch((error) => console.error("Error:", error));
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/login" />;
    }

    return (
      <div className="signup-container">
        <div className="login-button"><Link to='login'><button>Login</button></Link></div>
        <h2>Signup</h2>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={this.handleChange} />
          <input type="email" name="email" placeholder="Email" onChange={this.handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
          <button type="submit">Signup</button>
        </form>
      </div>
    );
  }
}

export default Signup;
