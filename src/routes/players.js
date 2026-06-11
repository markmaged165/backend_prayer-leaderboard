import { Router } from "express";
import mongoose from "mongoose";
import { Player } from "../models/Player.js";
import { seedPlayers } from "../data/seedPlayers.js";

const router = Router();

let fallbackPlayers = seedPlayers.map((player) => ({ ...player }));

function sortPlayers(players) {
  return [...players].sort((a, b) => a.id - b.id);
}

function useMongo() {
  return mongoose.connection.readyState === 1;
}

function normalizePlayer(player) {
  return {
    id: Number(player.id),
    name: String(player.name || "").trim(),
    score: Number(player.score ?? 0),
    hearts: Number(player.hearts ?? 3),
    freeze: Number(player.freeze ?? 0),
  };
}

function replaceFallbackPlayers(players) {
  fallbackPlayers = players.map(normalizePlayer);
  return sortPlayers(fallbackPlayers);
}

function deleteFallbackPlayer(id) {
  const nextPlayers = fallbackPlayers.filter((player) => player.id !== id);
  if (nextPlayers.length === fallbackPlayers.length) {
    return null;
  }
  fallbackPlayers = nextPlayers;
  return { ok: true };
}

router.get("/", async (_req, res, next) => {
  try {
    if (useMongo()) {
      const players = await Player.find().lean();
      res.json(sortPlayers(players));
      return;
    }

    res.json(sortPlayers(fallbackPlayers));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.name || typeof payload.name !== "string") {
      return res.status(400).json({ error: "Player name is required" });
    }

    const normalized = normalizePlayer({
      id: payload.id ?? Date.now(),
      ...payload,
    });

    if (useMongo()) {
      const existing = await Player.findOne({ id: normalized.id }).lean();
      if (existing) {
        return res.status(409).json({ error: "Player id already exists" });
      }

      const created = await Player.create(normalized);
      res.status(201).json(created.toObject());
      return;
    }

    if (fallbackPlayers.some((player) => player.id === normalized.id)) {
      return res.status(409).json({ error: "Player id already exists" });
    }

    fallbackPlayers = sortPlayers([...fallbackPlayers, normalized]);
    res.status(201).json(normalized);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (useMongo()) {
      const updated = await Player.findOneAndUpdate(
        { id },
        {
          ...req.body,
          ...(req.body?.name ? { name: String(req.body.name).trim() } : {}),
        },
        { new: true, runValidators: true },
      ).lean();

      if (!updated) {
        return res.status(404).json({ error: "Player not found" });
      }

      res.json(updated);
      return;
    }

    const index = fallbackPlayers.findIndex((player) => player.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Player not found" });
    }

    fallbackPlayers[index] = normalizePlayer({
      ...fallbackPlayers[index],
      ...req.body,
      id,
    });

    res.json(fallbackPlayers[index]);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (useMongo()) {
      const deleted = await Player.findOneAndDelete({ id }).lean();
      if (!deleted) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json({ ok: true });
      return;
    }

    const deleted = deleteFallbackPlayer(id);
    if (!deleted) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (_req, res, next) => {
  try {
    if (useMongo()) {
      await Player.deleteMany({});
    } else {
      fallbackPlayers = [];
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  try {
    const players = Array.isArray(req.body) ? req.body : [];
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Players array is required" });
    }

    const normalized = players.map(normalizePlayer);

    if (useMongo()) {
      await Player.deleteMany({});
      await Player.insertMany(normalized);
      const inserted = await Player.find().lean();
      res.json(sortPlayers(inserted));
      return;
    }

    res.json(replaceFallbackPlayers(normalized));
  } catch (error) {
    next(error);
  }
});

export default router;
