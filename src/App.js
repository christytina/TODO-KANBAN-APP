import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./App.css";
import avatarImg from "./avatar.png";
import LoginForm from "./components/LoginForm";
import OverviewNav from "./components/OverviewNav";
import Task from "./components/Task";
import SearchBar from "./components/SearchBar";
import SideNav from "./components/SideNav";
import InitialTasks from "./components/InitialTasks";

const App = () => {
  const [tasks, setTasks] = useState(InitialTasks);
  const [newTaskContent, setNewTaskContent] = useState({
    todo: "",
    inProgress: "",
    done: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState("overview");
  const [overviewCounts, setOverviewCounts] = useState({
    todo: tasks["todo"].length,
    inProgress: tasks["inProgress"].length,
    done: tasks["done"].length,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const minUsernameLength = 2;
    const minPasswordLength = 2;
    if (username.trim().length < minUsernameLength) {
      alert(`Username must be at least ${minUsernameLength} characters long.`);
      return;
    }
    if (password.trim().length < minPasswordLength) {
      alert(`Password must be at least ${minPasswordLength} characters long.`);
      return;
    }
    setIsLoggedIn(true);
    localStorage.setItem("username", username);
    setPassword("");
    setActiveNavItem("home");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("username");
    setUsername("");
    setPassword("");
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setActiveNavItem("home");
    }
  }, []);

  const handleInputChange = (e, column) => {
    setNewTaskContent({ ...newTaskContent, [column]: e.target.value });
  };

  const handleFormSubmit = (e, column) => {
    e.preventDefault();
    if (newTaskContent[column].trim() !== "") {
      const newTask = {
        id: Date.now(),
        content: newTaskContent[column],
      };
      setTasks({ ...tasks, [column]: [...tasks[column], newTask] });
      setNewTaskContent({ ...newTaskContent, [column]: "" });
      updateOverviewCounts({ ...tasks, [column]: [...tasks[column], newTask] });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
    if (navItem === "overview") {
      setOverviewCounts({
        todo: tasks["todo"].length,
        inProgress: tasks["inProgress"].length,
        done: tasks["done"].length,
      });
    }
  };

  const handleTaskDelete = (taskId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmation) {
      const updatedTasks = {};

      for (const [key, value] of Object.entries(tasks)) {
        updatedTasks[key] = value.filter((task) => task.id !== taskId);
      }

      setTasks(updatedTasks);
      updateOverviewCounts(updatedTasks);
    }
  };

  const updateOverviewCounts = (tasks) => {
    setOverviewCounts({
      todo: tasks["todo"].length,
      inProgress: tasks["inProgress"].length,
      done: tasks["done"].length,
    });
  };

  const filteredTasks = Object.keys(tasks).reduce((filtered, column) => {
    const columnTasks = tasks[column].filter((task) =>
      task.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...filtered, [column]: columnTasks };
  }, {});

  const renderAvatarAndLogout = () => {
    return (
      <div className="avatar-logout-container">
        <img src={avatarImg} alt="Avatar" className="avatar" />
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    );
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="app-container">
          <SideNav
            activeNavItem={activeNavItem}
            handleNavItemClick={handleNavItemClick}
          />
          <main className="main-content">
            {isLoggedIn && renderAvatarAndLogout()}
            {!isLoggedIn && (
              <div className="login-container">
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              </div>
            )}
            <SearchBar
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
            <h1>Tasks</h1>
            {activeNavItem === "overview" && (
              <OverviewNav overviewCounts={overviewCounts} />
            )}
            <DragDropContext onDragEnd={() => {}}>
              <div className="columns">
                {Object.keys(tasks).map((status) => (
                  <div key={status} className="column">
                    <h2>
                      {status.toUpperCase()} ({tasks[status].length})
                    </h2>
                    <form
                      onSubmit={(e) => handleFormSubmit(e, status)}
                      className="add-task-form"
                    >
                      <input
                        type="text"
                        value={newTaskContent[status]}
                        onChange={(e) => handleInputChange(e, status)}
                        placeholder="✚"
                        className="add-task-btn"
                      />
                    </form>
                    <Droppable droppableId={status}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {filteredTasks[status].map((task, index) => (
                            <Task
                              key={task.id}
                              task={task}
                              handleTaskDelete={handleTaskDelete}
                              index={index}
                            />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </main>
        </div>
      ) : (
        <div className="login-container">
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </div>
      )}
    </div>
  );
};

export default App;
