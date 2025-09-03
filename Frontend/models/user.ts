import { timeStamp } from "console";
import mongoose, { Document,Model, Schema } from "mongoose";

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  resetToken: string;
  resetTokenExpiry: Date;
}

const userSchema :Schema<IUser>=new mongoose.Schema ({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken:{type:String,required:false,},
  resetTokenExpiry:{type:Date,required:false,},
},
  {timestamps:true}
);

const User : Model<IUser>=mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;