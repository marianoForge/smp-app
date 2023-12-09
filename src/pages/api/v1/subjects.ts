import type { NextApiRequest, NextApiResponse } from "next";

import { connectMongoDB } from "@/libs/mongodb";
import Subject from "@/models/Subject";

type PostResponseData = {
  message: string;
  subject?: Subject;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Subject[] | PostResponseData | ErrorResponse>
) {
  await connectMongoDB();

  if (req.method === "GET") {
    try {
      const subjects = await Subject.find({});
      res.status(200).json(subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, description, teachersAssigned, pupilsAssigned } = req.body;

      // Ensure required fields are provided
      if (!name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const subject = await Subject.create({
        name,
        description,
        teachersAssigned,
        pupilsAssigned,
      });
      res.status(201).json({ message: "Subject created", subject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing subject ID" });
      }

      const subject = await Subject.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.status(200).json({ message: "Subject updated", subject });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing subject ID" });
      }

      const subject = await Subject.findByIdAndDelete(id);
      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }
      res.status(200).json({ message: "Subject deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
