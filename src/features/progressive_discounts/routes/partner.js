const express = require("express");
const router = express.Router();

const {
  createPartnerController,
  getPartnerByIdController,
  getAllPartnersController,
  updatePartnerController,
  deletePartnerController,
} = require("../controllers/partner");

router.get("/all", getAllPartnersController);
router.get("/:id", getPartnerByIdController);
router.post("/", createPartnerController);
router.patch("/:id", updatePartnerController);
router.delete("/:id", deletePartnerController);

module.exports = router;
