const express = require("express");
const router = express.Router();
const rendezvousController = require("../controllers/rendezvousController");

// Routes pour RendezVous
router.get("/", rendezvousController.getAllRendezvous);
router.get("/:id", rendezvousController.getRdvById);
router.post("/", rendezvousController.addRdv);
router.put("/:id", rendezvousController.updateRdv);
router.delete("/:id", rendezvousController.deleteRdv);

module.exports = router;
