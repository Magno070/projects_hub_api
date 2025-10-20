const Project = require("../models/ModelExample");
const { isValidObjectId, isValidUrl } = require("../utils/validation");

// Create new project
const createProject = async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, tags } =
      req.body;
    const author = req.user._id;

    // Basic validations
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Validate URLs if provided
    if (githubUrl && !isValidUrl(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL",
      });
    }

    if (liveUrl && !isValidUrl(liveUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project URL",
      });
    }

    const project = new Project({
      title,
      description,
      technologies: technologies || [],
      githubUrl,
      liveUrl,
      tags: tags || [],
      author,
    });

    await project.save();
    await project.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: {
        project,
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List all projects
const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, featured } = req.query;
    const query = {};

    // Filters
    if (status) query.status = status;
    if (featured === "true") query.featured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error listing projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id).populate("author", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.json({
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    console.error("Error getting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is the author or admin
    if (
      project.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this project",
      });
    }

    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      status,
      tags,
      featured,
    } = req.body;

    // Validate URLs if provided
    if (githubUrl && !isValidUrl(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL",
      });
    }

    if (liveUrl && !isValidUrl(liveUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project URL",
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (technologies) updateData.technologies = technologies;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
    if (status) updateData.status = status;
    if (tags) updateData.tags = tags;
    if (featured !== undefined && req.user.role === "admin")
      updateData.featured = featured;

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("author", "name email");

    res.json({
      success: true,
      message: "Project updated successfully",
      data: {
        project: updatedProject,
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user is the author or admin
    if (
      project.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this project",
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get projects of logged in user
const getMyProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;
    const query = { author: userId };

    if (status) query.status = status;

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
        },
      },
    });
  } catch (error) {
    console.error("Error getting user's projects:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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
