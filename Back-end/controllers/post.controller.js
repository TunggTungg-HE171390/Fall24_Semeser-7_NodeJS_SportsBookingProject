const postModel = require("../models/post.model");
const httpErrors = require("http-errors");

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    res.status(200).json({
      message: "List of posts",
      result: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.status(200).json({
      message: "Post found",
      result: post,
    });
  } catch (err) {
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const getPostsByOwner = async (req, res) => {
  try {
    const posts = await postModel.find({ ownerId: req.params.id });
    if (!posts) {
      throw httpErrors.NotFound("Posts not found");
    }
    res.status(200).json({
      message: "List of posts",
      result: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await postModel.create(req.body);
    res.status(201).json({
      message: "Post created",
      result: post,
    });
  } catch (err) {
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await postModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Post updated",
      result: post,
    });
  } catch (err) {
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const uploadImage = async (req, res) => {
  res.json({
    message: "File uploaded successfully",
  });
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  uploadImage,
};
