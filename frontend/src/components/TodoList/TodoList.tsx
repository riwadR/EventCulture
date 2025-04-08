import React, { useState } from "react";
function TodoList() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [task, setTask] = useState("");
  const addTask = () => {
    if (task.trim() !== "") {
      setTasks([...tasks, task]);
      setTask("");
    }
  };
  return (
    <div>
      <h2>Liste des tâches</h2>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Ajouter une tâche"
      />
      <button onClick={addTask}>Ajouter</button>

      <ul>
        {tasks.map((t, index) => (
          <li key={index}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
export default TodoList;