const express = require("express");
const router = express.Router();

const {
  createPartnerController,
  getPartnerByIdController,
  getAllPartnersController,
  getPartnerLogsController,
  updatePartnerController,
  deletePartnerController,
} = require("../controllers/partner");

// POST
router.post("/", createPartnerController);

// GET
router.get("/all", getAllPartnersController);
router.get("/", getPartnerByIdController);
router.get("/logs", getPartnerLogsController);

// PATCH
router.patch("/", updatePartnerController);
router.delete("/", deletePartnerController);

module.exports = router;
