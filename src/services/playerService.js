const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class PlayerService {
  buildQuery(id) {
    const numericId = Number(id);
    if (!Number.isNaN(numericId) && String(numericId) === String(id)) {
      return { id: numericId };
    }

    if (ObjectId.isValid(id)) {
      return { _id: new ObjectId(id) };
    }

    return { id };
  }

  async getAllPlayers() {
    const db = await getDb();
    return await db.collection("players").find().toArray();
  }

  async getPlayerById(id) {
    const db = await getDb();
    return await db.collection("players").findOne(this.buildQuery(id));
  }

  async createPlayer(playerData) {
    const db = await getDb();
    const result = await db.collection("players").insertOne(playerData);
    return result;
  }

  async updatePlayer(id, updateData) {
    const db = await getDb();
    const result = await db.collection("players").updateOne(
      this.buildQuery(id),
      { $set: updateData }
    );
    return result;
  }

  async deletePlayer(id) {
    const db = await getDb();
    const result = await db.collection("players").deleteOne(
      this.buildQuery(id)
    );
    return result;
  }

  async replaceAllPlayers(players) {
    const db = await getDb();
    await db.collection("players").deleteMany({});
    const result = await db.collection("players").insertMany(players);
    return result;
  }
}

module.exports = new PlayerService();
