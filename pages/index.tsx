import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import { Task } from '@/pages/api/task';
import TaskList from '@/components/TaskList';

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/task');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/task/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }
  };

  const handleUpdate = async (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    console.log(taskToUpdate)
    if (taskToUpdate) {
      const response = await fetch(`/api/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskToUpdate,
          completed: !taskToUpdate.completed,
        }),
      });
      if (response.ok) {
        const updatedTask: Task = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        completed: false,
      }),
    });

    if (response.ok) {
      const task: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, task]);
      setName('');
    }
  };

  return (
    <div>
      <Head>
        <title>Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Todo App</h1>

        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit">Add Task</button>
        </form>

        <TaskList tasks={tasks} handleDelete={handleDelete} handleUpdate={handleUpdate} />
      </main>
    </div>
  );
};

export default Home;