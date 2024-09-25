import React, { Component } from "react";
import {Link} from 'react-router-dom'

import './index.css'

class Profile extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    updatedMessage: ''
  };

  componentDidMount() {
    this.fetchProfile();
  }

  fetchProfile = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => this.setState({ name: data.name, email: data.email }))
      .catch((error) => console.error("Error:", error));
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const { name, email, password } = this.state;

    fetch("http://localhost:5000/api/profile/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then(() => this.setState({updatedMessage: 'Profile Updated Successfully'}))
      .catch((error) => console.error("Error:", error));
  };

  render() {
    const {updatedMessage} = this.state

    return (
      <div>
        <div className="dashboard-button"><Link to='/'><button>Dashboard</button></Link></div>
        <h2>Update Profile</h2>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
          />
          <button type="submit">Update</button>
          <p>{updatedMessage}</p>
        </form>
      </div>
    );
  }
}

export default Profile;
