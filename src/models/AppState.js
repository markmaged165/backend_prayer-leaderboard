import mongoose from "mongoose";

const appStateSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    rounds: { type: mongoose.Schema.Types.Mixed, default: {} },
    seasons: { type: mongoose.Schema.Types.Mixed, default: [] },
    news: { type: mongoose.Schema.Types.Mixed, default: [] },
    notice: { type: String, default: "" },
    seasonStart: { type: String, default: "" },
    seasonLabel: { type: String, default: "الموسم الأول" },
    lastScoreDate: { type: String, default: null },
  },
  { timestamps: true },
);

export const AppState = mongoose.model("AppState", appStateSchema);
