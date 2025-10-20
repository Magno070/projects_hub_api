const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must be at most 500 characters"],
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    githubUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+/,
        "Invalid GitHub URL",
      ],
    },
    liveUrl: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Invalid URL"],
    },
    status: {
      type: String,
      enum: ["draft", "in progress", "completed", "archived"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ author: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });

module.exports = mongoose.model("Project", projectSchema);
