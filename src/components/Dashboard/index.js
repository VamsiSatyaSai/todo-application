import React, { Component } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate for redirection
import './index.css';  // Importing component-specific CSS

class Dashboard extends Component {
  state = {
    tasks: [],
    title: '',
    status: 'pending',
    redirectToLogin: false,  // State to manage redirection on logout
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    const token = localStorage.getItem("token");
    fetch("https://todo-application-backend-yrpf.onrender.com/api/tasks", {
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => response.json())
      .then((data) => this.setState({ tasks: data }))
      .catch((error) => console.error("Error:", error));
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, status } = this.state;
    const token = localStorage.getItem("token");

    fetch("https://todo-application-backend-yrpf.onrender.com/api/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, status }),
    })
      .then(() => this.fetchTasks())
      .catch((error) => console.error("Error:", error));
  };

  handleDelete = (taskId) => {
    const token = localStorage.getItem("token");

    fetch(`https://todo-application-backend-yrpf.onrender.com/api/tasks/delete/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => this.fetchTasks())
      .catch((error) => console.error("Error:", error));
  };

  handleLogout = () => {
    localStorage.removeItem("token");  // Remove JWT token
    this.setState({ redirectToLogin: true });  // Redirect to login page
  };

  render() {
    if (this.state.redirectToLogin) {
      return <Navigate to="/" />;  // Redirect to login page after logout
    }

    return (
      <div className="dashboard-container">
        <h2>Task Dashboard</h2>

        {/* Logout Button */}
        <button onClick={this.handleLogout} className="logout-btn">
          Logout
        </button>

        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={this.state.title}
            onChange={this.handleInputChange}
          />
          <select name="status" value={this.state.status} onChange={this.handleInputChange}>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
        
        <ul>
          {this.state.tasks.map((task) => (
            <li key={task.id}>
              {task.title} - {task.status}
              <button className="delete-btn" onClick={() => this.handleDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Dashboard;
