import React, { useEffect, useState } from 'react';
import { Task } from '@/pages/api/task';

type TaskProps = {
  task: Task;
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (id: string) => Promise<void>;
};

const Task: React.FC<TaskProps> = ({ task, handleDelete, handleUpdate }) => {
  return (
    <li key={task.id}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => handleUpdate(task.id)}
      />
      <span>{task.name}</span>
      <button onClick={() => handleDelete(task.id)}>Delete</button>
    </li>
  );
};

type TaskListProps = {
  tasks: Task[];
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (id: string) => Promise<void>;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, handleDelete, handleUpdate }) => {
  const [updatedTasks, setUpdatedTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setUpdatedTasks(tasks);
  }, [tasks]);

  // const handleCheckboxChange = async (taskId: string) => {
  //   const taskToUpdate = updatedTasks.find((task) => task.id === taskId);

  //   if (taskToUpdate) {
  //     const response = await fetch(`/api/task/${taskId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ...taskToUpdate,
  //         completed: !taskToUpdate.completed,
  //       }),
  //     });

  //     if (response.ok) {
  //       const updatedTask: Task = await response.json();
  //       setUpdatedTasks((prevTasks) =>
  //         prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
  //       );
  //     }
  //   }
  // };

  // const handleButtonClick = async (taskId: string) => {
  //   const response = await fetch(`/api/task/${taskId}`, {
  //     method: 'DELETE',
  //   });

  //   if (response.ok) {
  //     setUpdatedTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  //   }
  // };

  return (
    <ul>
      {updatedTasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleUpdate(task.id)}
          />
          <span>{task.name}</span>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;