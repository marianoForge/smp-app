import { Schema, model, models, connect } from "mongoose";
import { ObjectId } from "mongodb";

interface PupilType {
  name: string;
  email: string;
  dob?: Date;
  age: number;
  gender: string;
  phone?: string;
  tutor: string;
  tutorContact: string;
  subjects?: ObjectId[];
  timestamp: Date;
}

const PupilSchema = new Schema<PupilType>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String },
  tutor: { type: String, required: true },
  tutorContact: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
  timestamp: { type: Date, default: Date.now },
});

const Pupil = models.Pupil || model<PupilType>("Pupil", PupilSchema);

// run().catch((err) => console.log(err));

// async function run() {
//   await connect(process.env.MONGODB_URI || "");
//   const pupil = await Pupil.create({
//     name: "John Doe",
//     age: 12,
//     email: "joh@doe.com",
//     tutor: "Jane Doe",
//     tutorContact: "767776767",
//     phone: "767776767",
//   });
//   console.log(pupil);
// }

export default Pupil;
