const express = require("express");
const seasonController = require("../controllers/seasonController");

const router = express.Router();

router.get("/", seasonController.getAll.bind(seasonController));
router.get("/:id", seasonController.getById.bind(seasonController));
router.post("/", seasonController.create.bind(seasonController));
router.post("/batch", seasonController.replaceAll.bind(seasonController));
router.put("/:id", seasonController.update.bind(seasonController));
router.delete("/:id", seasonController.delete.bind(seasonController));

module.exports = router;
