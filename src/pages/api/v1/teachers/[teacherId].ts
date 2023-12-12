import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import Teacher from "@/models/Teacher";
import { connectMongoDB } from "@/libs/mongodb";

type ResponseData = {
  message?: string;
  teacher?: Teacher | null;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await connectMongoDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { teacherId } = req.query;

  if (!teacherId || Array.isArray(teacherId)) {
    return res.status(400).json({ error: "Invalid teacher ID" });
  }

  if (req.method === "GET") {
    try {
      const teacher = (await Teacher.findById(teacherId).populate(
        "subjects"
      )) as Teacher | null;
      if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
      }
      return res.status(200).json({ teacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Handle other HTTP methods or return 405 for unsupported methods
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
