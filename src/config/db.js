import mongoose from "mongoose";
import process from "node:process";
import "dotenv/config";

const DB_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS || 8000);

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  let timeoutId;

  try {
    const connectPromise = mongoose.connect(uri, {
      connectTimeoutMS: DB_TIMEOUT_MS,
      serverSelectionTimeoutMS: DB_TIMEOUT_MS,
    });
    connectPromise.catch(() => {});

    await Promise.race([
      connectPromise,
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () =>
            reject(
              new Error(
                `MongoDB connection timed out after ${DB_TIMEOUT_MS}ms`,
              ),
            ),
          DB_TIMEOUT_MS,
        );
      }),
    ]);

    const dbHost = mongoose.connection.host || "configured host";
    console.log(`Connected to MongoDB (${dbHost})`);
    return true;
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    console.warn("MongoDB is unavailable; API will use the fallback store.");
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
