import { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import middleware from "@/middlewares/middlewares";
import nextConnect from "next-connect";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export type Task = {
  id: string;
  name: string;
  completed: boolean;
};

type Tasks = Task[];

const tasksFilePath = path.join(process.cwd(), "tasks.json");

export const readTasksFile = (): Tasks => {
  try {
    const tasksFileContent = fs.readFileSync(tasksFilePath, "utf-8");
    return JSON.parse(tasksFileContent);
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const writeTasksFile = (tasks: Tasks): void => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks));
  } catch (err) {
    console.error(err);
  }
};

const handler = nextConnect<NextApiRequest, NextApiResponse<Tasks | Task | { message: string }>>();

handler.use(middleware);

handler.get((req, res) => {
  // READ operation
  const tasks = readTasksFile();
  res.status(200).json(tasks);
});

handler.post((req, res) => {
  // CREATE operation
  const { name } = req.body;
  const tasks = readTasksFile();
  const existingTask = tasks.find((task) => task.name === name);
  if (existingTask) {
    res.status(409).json({ message: "Task already exists" });
  } else {
    const newTask: Task = {
      id: uuidv4(),
      name,
      completed: false,
    };
    tasks.push(newTask);
    writeTasksFile(tasks);
    res.status(201).json(newTask);
  }
});

handler.put((req, res) => {
  // UPDATE operation
  const { id, name, completed } = req.body;
  console.log(req.body)
  const tasks = readTasksFile();
  const index = tasks.findIndex((task) => task.id as string === id as string);
  if (index !== -1) {
    const existingTask = tasks.find((task) => task.name === name && task.id !== id);
    if (existingTask) {
      res.status(409).json({ message: "Task with the same name already exists" });
    } else {
      const updatedTask: Task = {
        id,
        name,
        completed,
      };
      tasks[index] = updatedTask;
      writeTasksFile(tasks);
      res.status(200).json(updatedTask);
    }
  } else {
    res.status(404).json({ message: `Task with id ${id} not found` });
  }
});

handler.delete((req, res) => {
  // DELETE operation
  const { id } = req.body;
  const tasks = readTasksFile();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    writeTasksFile(tasks);
    res.status(200).json({ message: `Task with id ${id} deleted successfully` });
  } else {
    res.status(404).json({ message: `Task with id ${id} not found` });
  }
});

export default handler;