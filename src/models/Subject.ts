import { Schema, model, models } from "mongoose";
import { ObjectId } from "mongodb";

interface SubjectType {
  name: string;
  description: string;
  teachersAssigned?: ObjectId[];
  pupilsAssigned?: ObjectId[];
  timestamp: Date;
}

const SubjectSchema = new Schema<SubjectType>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teachersAssigned: [{ type: ObjectId, ref: "Teacher" }],
  pupilsAssigned: [{ type: ObjectId, ref: "Pupil" }],
  timestamp: { type: Date, default: Date.now },
});

const Subject = models.Subject || model<SubjectType>("Subject", SubjectSchema);

export default Subject;
