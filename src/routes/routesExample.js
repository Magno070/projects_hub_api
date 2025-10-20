const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
} = require("../controllers/controllerExample");

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.get("/my/projects", getMyProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
