const express = require("express");
const playerController = require("../controllers/playerController");

const router = express.Router();

router.get("/", playerController.getAll.bind(playerController));
router.get("/:id", playerController.getById.bind(playerController));
router.post("/", playerController.create.bind(playerController));
router.post("/batch", playerController.replaceAll.bind(playerController));
router.put("/:id", playerController.update.bind(playerController));
router.delete("/:id", playerController.delete.bind(playerController));

module.exports = router;
