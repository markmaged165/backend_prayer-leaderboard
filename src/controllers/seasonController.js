const seasonService = require("../services/seasonService");

class SeasonController {
  async getAll(req, res) {
    try {
      const seasons = await seasonService.getAllSeasons();
      res.json(seasons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const season = await seasonService.getSeasonById(req.params.id);
      if (!season) return res.status(404).json({ error: "Season not found" });
      res.json(season);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const result = await seasonService.createSeason(req.body);
      res.status(201).json({ success: true, insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const result = await seasonService.updateSeason(req.params.id, req.body);
      res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async replaceAll(req, res) {
    try {
      const seasons = Array.isArray(req.body) ? req.body : [];
      if (seasons.length === 0) {
        return res.json({ success: true, message: "No seasons to update" });
      }
      const result = await seasonService.replaceAllSeasons(seasons);
      res.json({ success: true, insertedCount: result.insertedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await seasonService.deleteSeason(req.params.id);
      res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SeasonController();
