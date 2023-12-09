import type { NextApiRequest, NextApiResponse } from "next";
import Pupil from "@/models/Pupil";
import { connectMongoDB } from "@/libs/mongodb";
import { Types } from "mongoose"; // Import Mongoose Types

type PostResponseData = {
  message: string;
  pupil?: Pupil;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Pupil[] | PostResponseData | ErrorResponse>
) {
  await connectMongoDB();

  if (req.method === "GET") {
    try {
      // Use .populate() to include subject details and assert the type
      const pupils = (await Pupil.find({}).populate("subjects")) as Pupil[];
      res.status(200).json(pupils);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      const {
        name,
        email,
        dob,
        age,
        gender,
        phone,
        tutor,
        tutorContact,
        subjects,
      } = req.body;

      // Convert subjects to ObjectIds
      const subjectIds = subjects.map(
        (subject: string) => new Types.ObjectId(subject)
      );

      // Ensure required fields are provided
      if (!name || !email || !age || !gender || !tutor || !tutorContact) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const pupil = await Pupil.create({
        name,
        email,
        dob,
        age,
        gender,
        phone,
        tutor,
        tutorContact,
        subjects: subjectIds,
      });

      res.status(201).json({ message: "Pupil created", pupil });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, subjects, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing pupil ID" });
      }

      // Convert subjects to ObjectIds if provided
      if (subjects) {
        updateData.subjects = subjects.map(
          (subject: string) => new Types.ObjectId(subject)
        );
      }

      const pupil = await Pupil.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("subjects");

      if (!pupil) {
        return res.status(404).json({ error: "Pupil not found" });
      }
      res.status(200).json({ message: "Pupil updated", pupil });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Missing pupil ID" });
      }

      const pupil = await Pupil.findByIdAndDelete(id);
      if (!pupil) {
        return res.status(404).json({ error: "Pupil not found" });
      }
      res.status(200).json({ message: "Pupil deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
