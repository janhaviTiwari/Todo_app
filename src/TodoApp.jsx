import React, { useState, useEffect } from "react";
import "./App.css";

const FILTER_MAP = {
  All: () => true,
  Completed: (task) => task.completed,
  Incomplete: (task) => !task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
    const theme = localStorage.getItem("darkMode");
    if (theme) setDarkMode(theme === "true");
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { text: input, completed: false, due: "" },
    ]);
    setInput("");
  };

  const handleToggle = (idx) => {
    setTasks(
      tasks.map((t, i) =>
        i === idx ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx, text) => {
    setEditIdx(idx);
    setEditText(text);
  };

  const handleEditSave = (idx) => {
    setTasks(
      tasks.map((t, i) => (i === idx ? { ...t, text: editText } : t))
    );
    setEditIdx(null);
    setEditText("");
  };

  const handleDueDate = (idx, date) => {
    setTasks(
      tasks.map((t, i) => (i === idx ? { ...t, due: date } : t))
    );
  };

  const filteredTasks = tasks.filter(FILTER_MAP[filter]);

  return (
    <div className={`todo-container${darkMode ? " dark" : ""}`}> 
      <div className="header-row">
        <h1>To-Do List</h1>
        <button className="mode-toggle" onClick={() => setDarkMode((d) => !d)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>
      <form onSubmit={handleAdd} className="add-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>
      <div className="filters">
        {FILTER_NAMES.map((name) => (
          <button
            key={name}
            className={filter === name ? "active" : ""}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <div className="task-count">{filteredTasks.length} tasks</div>
      <ul className="task-list">
        {filteredTasks.map((task, idx) => (
          <li key={idx} className={task.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(tasks.indexOf(task))}
            />
            {editIdx === tasks.indexOf(task) ? (
              <>
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEditSave(tasks.indexOf(task))}
                  autoFocus
                />
                <button onClick={() => handleEditSave(tasks.indexOf(task))}>Save</button>
                <button onClick={() => setEditIdx(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  className="task-text"
                  onDoubleClick={() => handleEdit(tasks.indexOf(task), task.text)}
                >
                  {task.text}
                </span>
                <input
                  type="date"
                  className="due-date"
                  value={task.due || ""}
                  onChange={(e) => handleDueDate(tasks.indexOf(task), e.target.value)}
                />
                <div className="task-actions">
                  <button onClick={() => handleEdit(tasks.indexOf(task), task.text)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(tasks.indexOf(task))}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
