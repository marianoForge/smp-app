// File: /pages/api/teachers.ts (or similar path according to your project structure)

import type { NextApiRequest, NextApiResponse } from "next";
import Teacher from "@/models/Teacher";
import { connectMongoDB } from "@/libs/mongodb";
import { Types } from "mongoose";

type PostResponseData = {
  message: string;
  teacher?: Teacher;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Teacher[] | PostResponseData | ErrorResponse>
) {
  await connectMongoDB();

  if (req.method === "GET") {
    try {
      const teachers = (await Teacher.find({}).populate(
        "subjects"
      )) as Teacher[];
      res.status(200).json(teachers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, phone, subjects } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const teacher = await Teacher.create({
        name,
        email,
        phone,
        subjects: subjects?.map(
          (subject: string) => new Types.ObjectId(subject)
        ),
      });

      res.status(201).json({ message: "Teacher created", teacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing teacher ID" });
      }

      if (updateData.subjects) {
        updateData.subjects = updateData.subjects.map(
          (subject: string) => new Types.ObjectId(subject)
        );
      }

      const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("subjects");

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      res.status(200).json({ message: "Teacher updated", teacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing teacher ID" });
      }

      const teacher = await Teacher.findByIdAndDelete(id);

      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      res.status(200).json({ message: "Teacher deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
