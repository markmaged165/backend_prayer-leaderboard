import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    score: { type: Number, required: true, default: 0 },
    hearts: { type: Number, required: true, default: 3, min: 0, max: 3 },
    freeze: { type: Number, required: true, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

export const Player = mongoose.model("Player", playerSchema);
