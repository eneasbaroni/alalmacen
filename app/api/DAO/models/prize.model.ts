import mongoose, { Schema, models } from "mongoose";

const prizeCollections = "prize";
const prizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pointsRequired: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: "empty.png",
    },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Prize = models.prize || mongoose.model(prizeCollections, prizeSchema);

export default Prize;
