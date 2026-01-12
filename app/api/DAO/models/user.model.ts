import mongoose, { Schema, models } from "mongoose";

const userCollections = "user";
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    dni: {
      type: Number,
      unique: true,
      sparse: true, // Permite múltiples null
    },
  },
  { timestamps: true }
);

//const User = mongoose.model(userCollections, userSchema)

const User = models.user || mongoose.model(userCollections, userSchema);

export default User;
