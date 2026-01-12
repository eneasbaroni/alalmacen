import mongoose, { Schema, models } from "mongoose";
const transactionCollections = "transaction";
const transactionSchema = new Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["purchase", "redeem"],
      required: true,
    },
    concept: {
      type: String,
      required: true,
      default: "Compra en el local",
    },
    points: {
      type: Number,
      required: true,
    },
    prizeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prize",
      required: function () {
        return this.type === "redeem" && this.prizeType === "prize";
      },
    },
    prizeType: {
      type: String,
      enum: ["prize", "cashback"],
      required: function () {
        return this.type === "redeem";
      },
    },
    cashbackAmount: {
      type: Number,
      required: function () {
        return this.type === "redeem" && this.prizeType === "cashback";
      },
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      required: function (this: any): boolean {
        return this.type === "redeem" && this.prizeType === "prize";
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      default: function (this: any): string | undefined {
        return this.type === "redeem" && this.prizeType === "prize"
          ? "pending"
          : undefined;
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Índice para consultas rápidas por usuario
transactionSchema.index({ userID: 1, createdAt: -1 });

// Índice compuesto para consultas de premios pendientes
transactionSchema.index({ type: 1, prizeType: 1, status: 1 });

const Transaction =
  models.transaction ||
  mongoose.model(transactionCollections, transactionSchema);

export default Transaction;
