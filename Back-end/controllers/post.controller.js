const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const { POST_STATUS, USER_ROLES } = require("../utils/codes");

const storage = require("../utils/firebase.config");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");

const getAllPosts = async (req, res) => {
  console.log(`getAllPosts`);
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
    const posts = await postModel.find({ ownerId: req.params.ownerId }).exec();
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
  console.log("Data: ", req.body);
  try {
    const ownerId = req.params.id;

    const body = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(),
      image: [],
      status: POST_STATUS.PENDING,
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
    if (req.files) {
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
      post.image = imageUrls;
      await post.save();
    }
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
    const userId = req.query.userId;
    const userInfo = await userModel.findById(userId);
    const post = await postModel.findOne({ _id: postId });
    console.log(userInfo.role);
    if (!userInfo) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (userInfo.role !== USER_ROLES.FIELD_OWNER && post.ownerId !== userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }

    post.status = POST_STATUS.DELETED;
    await post.save();

    res.status(200).json({
      message: "Post deleted",
      result: post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: err.status,
      message: err.message,
    });
  }
};

const getPostsPending = async (req, res, next) => {
  try {
    const posts = await postModel.find({ status: POST_STATUS.PENDING }).exec();

    res.status(200).json({
      message: "List of posts",
      result: posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: err.status || 500,
      message: err.message,
    });
  }
};

const updateStatusOfPosts = async (req, res) => {
  const { postIds, userId, newStatus } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        message: "You are not authorized to update posts",
      });
    }

    if (!Array.isArray(postIds) || !postIds.length || !newStatus) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    const result = await postModel.updateMany(
      {
        _id: { $in: postIds },
      },
      { status: newStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      numberOfAffectedDocuments: result.modifiedCount,
      message: `Posts updated to ${newStatus}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: err.status || 500,
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
  getPostsByOwner,
  getPostsPending,
  updateStatusOfPosts,
};
