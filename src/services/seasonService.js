const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class SeasonService {
  async getAllSeasons() {
    const db = await getDb();
    return await db.collection("seasons").find().toArray();
  }

  async getSeasonById(id) {
    const db = await getDb();
    return await db.collection("seasons").findOne({ _id: new ObjectId(id) });
  }

  async createSeason(seasonData) {
    const db = await getDb();
    const result = await db.collection("seasons").insertOne(seasonData);
    return result;
  }

  async updateSeason(id, updateData) {
    const db = await getDb();
    const result = await db.collection("seasons").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return result;
  }

  async replaceAllSeasons(seasons) {
    const db = await getDb();
    await db.collection("seasons").deleteMany({});
    const result = await db.collection("seasons").insertMany(seasons);
    return result;
  }

  async deleteSeason(id) {
    const db = await getDb();
    const result = await db.collection("seasons").deleteOne(
      { _id: new ObjectId(id) }
    );
    return result;
  }
}

module.exports = new SeasonService();
