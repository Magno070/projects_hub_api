const Project = require("../models/ModelExample");
const { isValidObjectId, isValidUrl } = require("../utils/validation");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/apiError");

/**
 * @param {Object} projectData - Project data (title, description, etc.)
 * @param {String} authorId - ID of the logged in user
 * @returns {Promise<Project>}
 */
const create = async (projectData, authorId) => {
  const { title, description, githubUrl, liveUrl, technologies, tags } =
    projectData;

  if (!title || !description) {
    throw new BadRequestError("Title and description are required");
  }
  if (githubUrl && !isValidUrl(githubUrl)) {
    throw new BadRequestError("Invalid GitHub URL");
  }
  if (liveUrl && !isValidUrl(liveUrl)) {
    throw new BadRequestError("Invalid project URL");
  }

  const project = new Project({
    title,
    description,
    technologies: technologies || [],
    githubUrl,
    liveUrl,
    tags: tags || [],
    author: authorId,
  });

  await project.save();
  await project.populate("author", "name email");

  return project;
};

/**
 * @param {Object} options - Query options (page, limit, status, etc.)
 * @returns {Promise<Object>}
 */
const list = async (options = {}) => {
  const { page = 1, limit = 10, status, search, featured } = options;
  const query = {};

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

  return {
    projects,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    },
  };
};

/**
 * @param {String} id - Project ID
 * @returns {Promise<Project>}
 */
const getById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid project ID");
  }

  const project = await Project.findById(id).populate("author", "name email");

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return project;
};

/**
 * @param {String} id - Project ID
 * @param {Object} updateData - Data to be updated
 * @param {Object} user - Logged in user (for permission verification)
 * @returns {Promise<Project>}
 */
const update = async (id, updateData, user) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid project ID");
  }

  const { githubUrl, liveUrl, featured } = updateData;
  if (githubUrl && !isValidUrl(githubUrl)) {
    throw new BadRequestError("Invalid GitHub URL");
  }
  if (liveUrl && !isValidUrl(liveUrl)) {
    throw new BadRequestError("Invalid project URL");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const isAuthor = project.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError("You do not have permission to edit this project");
  }

  if (featured !== undefined && !isAdmin) {
    delete updateData.featured;
  }

  const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("author", "name email");

  return updatedProject;
};

/**
 * @param {String} id - Project ID
 * @param {Object} user - Logged in user (for permission verification)
 * @returns {Promise<void>}
 */
const remove = async (id, user) => {
  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid project ID");
  }

  const project = await Project.findById(id);
  if (!project) {
    throw new NotFoundError("Project not found");
  }

  const isAuthor = project.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError(
      "You do not have permission to delete this project"
    );
  }

  await Project.findByIdAndDelete(id);
};

/**
 * @param {String} authorId - ID of the logged in user
 * @param {Object} options - Query options (page, limit, status)
 * @returns {Promise<Object>}
 */
const listByUser = async (authorId, options = {}) => {
  const { page = 1, limit = 10, status } = options;
  const query = { author: authorId };

  if (status) query.status = status;

  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Project.countDocuments(query);

  return {
    projects,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    },
  };
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  listByUser,
};
