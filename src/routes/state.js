import { Router } from "express";
import mongoose from "mongoose";
import { AppState } from "../models/AppState.js";

const router = Router();

const today = () => new Date().toISOString().split("T")[0];

let fallbackState = normalizeState({});

function useMongo() {
  return mongoose.connection.readyState === 1;
}

function normalizeState(state) {
  return {
    rounds: state?.rounds && typeof state.rounds === "object" ? state.rounds : {},
    seasons: Array.isArray(state?.seasons) ? state.seasons : [],
    news: Array.isArray(state?.news) ? state.news : [],
    notice: typeof state?.notice === "string" ? state.notice : "",
    seasonStart:
      typeof state?.seasonStart === "string" && state.seasonStart
        ? state.seasonStart
        : today(),
    seasonLabel:
      typeof state?.seasonLabel === "string" && state.seasonLabel
        ? state.seasonLabel
        : "الموسم الأول",
    lastScoreDate:
      typeof state?.lastScoreDate === "string" ? state.lastScoreDate : null,
  };
}

function publicState(state) {
  const normalized = normalizeState(state);
  return {
    rounds: normalized.rounds,
    seasons: normalized.seasons,
    news: normalized.news,
    notice: normalized.notice,
    seasonStart: normalized.seasonStart,
    seasonLabel: normalized.seasonLabel,
    lastScoreDate: normalized.lastScoreDate,
  };
}

router.get("/", async (_req, res, next) => {
  try {
    if (useMongo()) {
      const state = await AppState.findOneAndUpdate(
        { key: "main" },
        { $setOnInsert: { key: "main", ...normalizeState({}) } },
        { new: true, upsert: true, lean: true },
      );
      res.json(publicState(state));
      return;
    }

    res.json(publicState(fallbackState));
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const normalized = normalizeState(req.body || {});

    if (useMongo()) {
      const state = await AppState.findOneAndUpdate(
        { key: "main" },
        { key: "main", ...normalized },
        { new: true, upsert: true, runValidators: true, lean: true },
      );
      res.json(publicState(state));
      return;
    }

    fallbackState = normalized;
    res.json(publicState(fallbackState));
  } catch (error) {
    next(error);
  }
});

export default router;
