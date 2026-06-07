const playerService = require("../services/playerService");

class PlayerController {
  async getAll(req, res) {
    try {
      const players = await playerService.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const player = await playerService.getPlayerById(req.params.id);
      if (!player) return res.status(404).json({ error: "Player not found" });
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const result = await playerService.createPlayer(req.body);
      res.status(201).json({ success: true, insertedId: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const result = await playerService.updatePlayer(req.params.id, req.body);
      res.json({ success: true, modifiedCount: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await playerService.deletePlayer(req.params.id);
      res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async replaceAll(req, res) {
    try {
      const players = Array.isArray(req.body) ? req.body : [];
      if (players.length === 0) {
        return res.json({ success: true, message: "No players to update" });
      }
      const result = await playerService.replaceAllPlayers(players);
      res.json({ success: true, insertedCount: result.insertedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PlayerController();
