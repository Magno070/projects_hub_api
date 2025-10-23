const express = require("express");
const router = express.Router();

const {
  createPartnerController,
  getPartnerByIdController,
  getAllPartnersController,
} = require("../controllers/partner");

router.post("/", createPartnerController);
router.get("/:id", getPartnerByIdController);
router.get("/", getAllPartnersController);

module.exports = router;
