import React, { Component } from "react";
import {Link} from 'react-router-dom'
import './index.css';  // Importing component-specific CSS

class Dashboard extends Component {
  state = {
    tasks: [],
    title: '',
    status: 'pending',
  };

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks = () => {
    const token = localStorage.getItem("token");
    console.log(token)
    fetch("http://localhost:5000/api/tasks", {
      headers: { "Content-Type": "application/json",
        Authorization: `Bearer ${token}` }
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

    fetch("http://localhost:5000/api/tasks/create", {
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

    fetch(`http://localhost:5000/api/tasks/delete/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => this.fetchTasks())
      .catch((error) => console.error("Error:", error));
  };

  handleStatusChange = (taskId, newStatus) => {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:5000/api/tasks/update/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update task status');
        }
        return response.json();
      })
      .then(() => this.fetchTasks()) // Refetch tasks after updating
      .catch((error) => console.error("Error:", error));
  };

  render() {
    return (
      <div className="dashboard-container">
        <div className="update-button"><Link to='/profile'><button>Update Profile</button></Link></div>
        <h2>Task Dashboard</h2>
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
              <select value={task.status} onChange={(e) => this.handleStatusChange(task.id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
                <option value="completed">Completed</option>
              </select>
              <button className="delete-btn" onClick={() => this.handleDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Dashboard;
