import { Schema, model, models, connect } from "mongoose";
import { ObjectId } from "mongodb";

interface UserType {
  name: string;
  email: string;
  image?: string;
  emailVerified: Date;
  adminRole: ObjectId[];
  editorRole: ObjectId[];
  viewerRole: ObjectId[];
}

const UserSchema = new Schema<UserType>({
  name: String,
  email: { type: String, unique: true },
  image: String,
  emailVerified: Date,
  adminRole: [{ type: ObjectId, ref: "AdminRole" }],
  editorRole: [{ type: ObjectId, ref: "EditorRole" }],
  viewerRole: [{ type: ObjectId, ref: "ViewerRole" }],
});

const User = models.Teacher || model<UserType>("Teacher", UserSchema);

export default User;
