import { NextApiRequest, NextApiResponse } from "next";
import handler, { readTasksFile, writeTasksFile } from "..";

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

handler.use(middleware);

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