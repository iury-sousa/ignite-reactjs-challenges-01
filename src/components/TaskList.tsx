import { useState } from "react";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare } from "react-icons/fi";

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

const currentIds: number[] = [];

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  function isExists(value: number) {
    return !!currentIds.find((id) => id === value);
  }

  function generateId() {
    const min = 0;
    const max = Number.MAX_SAFE_INTEGER;

    if (currentIds.length != max - min) {
      let value: number;
      let hasId: boolean = false;

      do {
        value = Math.floor(Math.random() * (max - min + 1)) + min;
        hasId = isExists(value);
      } while (hasId);

      currentIds.push(value);
      return value;
    } else {
      return 0;
    }
  }

  function findTaskById(id: number) {
    return tasks.find((task) => task.id === id);
  }

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.

    if (!newTaskTitle?.trim()) {
      return;
    }

    const id = generateId();
    const newTask: Task = {
      id,
      title: newTaskTitle,
      isComplete: false,
    };

    setTasks((oldTasks) => [...oldTasks, newTask]);
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID

    const task = findTaskById(id);

    if (task) {
      const taskIndex = tasks.indexOf(task);
      const tasksTemp = [...tasks];

      task.isComplete = !task.isComplete;
      tasksTemp.splice(taskIndex, 1, task);

      setTasks(tasksTemp);
    }
  }

  function handleRemoveTask(id: number) {
    setTasks((oldTasks) => oldTasks.filter((task) => task.id !== id));
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      e.preventDefault();
      handleCreateNewTask();
    }
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
            onKeyPress={handleKeyPress}
          />
          <button
            value={newTaskTitle}
            disabled={!newTaskTitle}
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
