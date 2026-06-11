import "dotenv/config";
import express from "express";
import cors from "cors";
import process from "node:process";
import mongoose from "mongoose";
import { connectDb } from "./src/config/db.js";
import { Player } from "./src/models/Player.js";
import { seedPlayers } from "./src/data/seedPlayers.js";
import playerRoutes from "./src/routes/players.js";
import stateRoutes from "./src/routes/state.js";
import dns from "node:dns/promises";
dns.setServers(["1.1.1.1"]);
const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/players", playerRoutes);
app.use("/api/state", stateRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Internal Server Error" });
});

async function seedIfEmpty() {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const count = await Player.countDocuments();
  if (count === 0) {
    await Player.insertMany(seedPlayers);
    console.log(`Seeded ${seedPlayers.length} players`);
  }
}

async function start() {
  await connectDb();
  await seedIfEmpty();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
