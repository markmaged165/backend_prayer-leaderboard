const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/prayer_leaderboard";
const dbName = process.env.MONGODB_DBNAME || "prayer_leaderboard";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;
let connected = false;

async function getDb() {
  if (!connected) {
    await client.connect();
    db = client.db(dbName);
    connected = true;
  }
  return db;
}

async function close() {
  if (connected) {
    await client.close();
    connected = false;
  }
}

module.exports = {
  getDb,
  close,
};
