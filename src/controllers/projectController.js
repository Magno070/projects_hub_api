const projectService = require("../services/project.service");

const createProject = async (req, res, next) => {
  try {
    const projectData = req.body;
    const authorId = req.user._id;

    const project = await projectService.create(projectData, authorId);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const result = await projectService.list(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await projectService.getById(id);

    res.status(200).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = req.user;

    const updatedProject = await projectService.update(id, updateData, user);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: {
        project: updatedProject,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    await projectService.remove(id, user);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMyProjects = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const options = req.query;

    const result = await projectService.listByUser(userId, options);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProjects,
};
