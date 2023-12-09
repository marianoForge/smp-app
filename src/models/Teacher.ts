import { Schema, model, models, connect } from "mongoose";
import { ObjectId } from "mongodb";

interface Teacher {
  name: string;
  email: string;
  phone?: string;
  subjects?: ObjectId[];
  timestamp: Date;
}

const TeacherSchema = new Schema<Teacher>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  timestamp: { type: Date, default: Date.now },
});

const Teacher = models.Teacher || model<Teacher>("Teacher", TeacherSchema);

export default Teacher;
