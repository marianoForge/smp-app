import { Schema, model, models, connect } from "mongoose";
import { ObjectId } from "mongodb";

interface Subject {
  name: string;
  description: string;
  teachersAssigned?: ObjectId[];
  pupilsAssigned?: ObjectId[];
  timestamp: Date;
}

const SubjectSchema = new Schema<Subject>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teachersAssigned: [{ type: Schema.Types.ObjectId, ref: "Teacher" }],
  pupilsAssigned: [{ type: Schema.Types.ObjectId, ref: "Pupil" }],
  timestamp: { type: Date, default: Date.now },
});

const Subject = models.Subject || model<Subject>("Subject", SubjectSchema);

export default Subject;
