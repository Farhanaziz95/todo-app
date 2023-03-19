import type { NextApiRequest, NextApiResponse } from "next";

import nextConnect from "next-connect";

const middleware = nextConnect<NextApiRequest, NextApiResponse>();

middleware.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    if (!req.body) {
      res.status(400).json({ message: "Missing request body" });
      return;
    }
  }
  next();
});

export default middleware;