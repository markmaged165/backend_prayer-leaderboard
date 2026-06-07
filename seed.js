const { getDb, close } = require("./db");
const { initialPlayers, defaultSeasons } = require("./seedData");

async function seed() {
  const db = await getDb();

  await Promise.all([
    db.collection("players").deleteMany({}),
    db.collection("seasons").deleteMany({}),
  ]);

  await Promise.all([
    db.collection("players").insertMany(initialPlayers),
    db.collection("seasons").insertMany(defaultSeasons),
  ]);

  console.log("MongoDB seed completed: players and seasons inserted.");
}

seed()
  .then(() => close())
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
