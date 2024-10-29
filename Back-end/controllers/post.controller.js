const postModel = require("../models/post.model");
const httpErrors = require("http-errors");
const { POST_STATUS } = require("../utils/codes");

const storage = require("../utils/firebase.config");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find({ status: POST_STATUS.PUBLISHED });
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
/**
 * Create a new post
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise<void>}
 */
  try {
    const ownerId = req.params.id;

    const body = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(),
      image: [],
      status: POST_STATUS.PUBLISHED,
      ownerId: ownerId,
      //fieldId: req.body.fieldId,
      filedId: null,
      location: {
        longitude: "",
        latitude: "",
        address: req.body.address,
      },
    };

    const post = await postModel.create(body);

    // Process images if provided
    const uploadPromises = req.files.map(async (image) => {
      const storageRef = ref(
        storage,
        `posts/${ownerId}/${post._id}/${image.originalname}`
      );

      const metadata = {
        contentType: image.mimetype,
      };

      const snapshot = await uploadBytes(storageRef, image.buffer, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL; // Return the download URL for each uploaded image
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log("Image URLs: " + imageUrls);
    post.image = imageUrls;
    await post.save();

    await postModel.findById(post._id).then((post) => {
      res.status(201).json({
        message: "Post created",
        result: post,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.location = {
      address: req.body.address || post.location.address,
    };

    //handle images
    const imagesToKeep = req.body.imagesToKeep || [];

    // delete images that are not in imagesToKeep
    const imagesToDelete = post.image.filter(
      (url) => !imagesToKeep.includes(url)
    );
    const deletePromises = imagesToDelete.map(async (url) => {
      try {
        // Extract the Firebase Storage path from the URL
        const path = decodeURIComponent(url.split("/o/")[1].split("?")[0]);

        const storageRef = ref(storage, path);
        await deleteObject(storageRef); // Remove from Firebase storage

        console.log(`Deleted: ${url}`);
      } catch (err) {
        console.error(`Error deleting image: ${err.message}`);
      }
    });
    await Promise.all(deletePromises);

    post.image = imagesToKeep;

    // Add new images if provided
    const uploadPromises = req.files.map(async (image) => {
      const storageRef = ref(
        storage,
        `posts/${ownerId}/${postId}/${image.originalname}`
      );
      const metadata = { contentType: image.mimetype };
      const snapshot = await uploadBytes(storageRef, image.buffer, metadata);
      return await getDownloadURL(snapshot.ref);
    });
    const newImageUrls = await Promise.all(uploadPromises);
    post.image.push(...newImageUrls);
    await post.save();

    await postModel.findById(postId).then((post) => {
      res.status(200).json({
        message: "Post updated",
        result: post,
      });
    });
  } catch (err) {
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postModel.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    post.status = POST_STATUS.DELETED;
    await post.save();

    res.status(200).json({
      message: "Post deleted",
      result: await postModel.findById(postId),
    });
  } catch (err) {
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
