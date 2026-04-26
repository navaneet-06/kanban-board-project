import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const [boards, setBoards] = useState(() => {
    const saved = localStorage.getItem("boards");
    return saved
      ? JSON.parse(saved)
      : [
          { title: "Planning", tasks: [] },
          { title: "Development", tasks: [] },
          { title: "Testing", tasks: [] },
          { title: "Deployment", tasks: [] },
          { title: "Monitoring", tasks: [] }
        ];
  });

  const [newBoard, setNewBoard] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(boards));
  }, [boards]);

  const login = () => {
    if (username.trim() !== "") setLoggedIn(true);
  };

  const addBoard = () => {
    if (newBoard.trim() === "") return;
    setBoards([...boards, { title: newBoard, tasks: [] }]);
    setNewBoard("");
  };

  const addTask = (index) => {
    const taskName = prompt("Enter Task Name");
    const priority = prompt("Priority: High / Medium / Low");
    const member = prompt("Assign Member");
    const due = prompt("Due Date");

    if (!taskName) return;

    const updated = [...boards];
    updated[index].tasks.push({
      name: taskName,
      priority: priority || "Medium",
      member: member || "Team",
      due: due || "N/A"
    });

    setBoards(updated);
  };

  const deleteTask = (boardIndex, taskIndex) => {
    const updated = [...boards];
    updated[boardIndex].tasks.splice(taskIndex, 1);
    setBoards(updated);
  };

  if (!loggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>DevOps Login</h1>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  const totalTasks = boards.reduce((sum, b) => sum + b.tasks.length, 0);

  return (
    <div className="app">
      <div className="top-header">
        <h1>DevOps Smart Dashboard</h1>
        <p>Welcome, {username}</p>
      </div>

      <div className="stats">
        <div className="card">Boards: {boards.length}</div>
        <div className="card">Tasks: {totalTasks}</div>
        <div className="card">User: {username}</div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search Tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="New Board Name"
          value={newBoard}
          onChange={(e) => setNewBoard(e.target.value)}
        />

        <button onClick={addBoard}>Add Board</button>
      </div>

      <div className="board-container">
        {boards.map((board, index) => (
          <div className="board" key={index}>
            <h2>{board.title}</h2>

            <button className="small-btn" onClick={() => addTask(index)}>
              + Add Task
            </button>

            {board.tasks
              .filter((task) =>
                task.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((task, i) => (
                <div className="task" key={i}>
                  <h4>{task.name}</h4>
                  <p>Priority: {task.priority}</p>
                  <p>Assigned: {task.member}</p>
                  <p>Due: {task.due}</p>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(index, i)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;