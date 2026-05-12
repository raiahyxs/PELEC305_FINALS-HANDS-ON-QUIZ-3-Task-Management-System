import React, { useState, useEffect } from 'react';
import { Check, RotateCcw, Trash2, PlusCircle, LayoutList } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const API_URL = 'http://127.0.0.1:8000/api/tasks/';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, is_completed: false }),
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTitle('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: task.title, is_completed: !task.is_completed }),
      });
      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const pendingTasks = tasks.filter(t => !t.is_completed);
  const completedTasks = tasks.filter(t => t.is_completed);

  return (
    <div className="app-wrapper">
      <div className="container">
        <div className="card">
          <header>
            <div className="logo-area">
              <LayoutList size={32} className="icon-primary" />
              <h1>Task</h1>
            </div>
            <p>Manage your projects and daily goals in one place.</p>
          </header>
          
          <form className="task-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a task description..."
            />
            <button type="submit" className="add-btn">
              <PlusCircle size={20} />
              <span>Add Task</span>
            </button>
          </form>

          <div className="task-grid">
            <div className="task-column">
              <div className="section-header">
                <span>Pending Tasks</span>
                <span className="badge">{pendingTasks.length}</span>
              </div>
              <div className="task-list">
                {pendingTasks.length === 0 ? (
                  <div className="empty-state">No pending tasks. You're all caught up!</div>
                ) : (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <span className="task-title">{task.title}</span>
                      <div className="button-group">
                        <button className="check-btn icon-btn" onClick={() => toggleComplete(task)}>
                          <Check size={18} />
                        </button>
                        <button className="delete-btn icon-btn" onClick={() => deleteTask(task.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="task-column">
              <div className="section-header completed-header">
                <span>Completed</span>
                <span className="badge green">{completedTasks.length}</span>
              </div>
              <div className="task-list">
                {completedTasks.length === 0 ? (
                  <div className="empty-state">No completed tasks yet.</div>
                ) : (
                  completedTasks.map((task) => (
                    <div key={task.id} className="task-item completed-item">
                      <span className="task-title task-done">{task.title}</span>
                      <div className="button-group">
                        <button className="undo-btn icon-btn" onClick={() => toggleComplete(task)}>
                          <RotateCcw size={18} />
                        </button>
                        <button className="delete-btn icon-btn" onClick={() => deleteTask(task.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;