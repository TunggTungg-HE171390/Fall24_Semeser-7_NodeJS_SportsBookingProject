const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { PostController } = require("../controllers");

const upload = require("../utils/multer.config");

// Get all posts
router.get("/", PostController.getAllPosts);

// Get post by id
router.get("/:id", PostController.getPostById);

// Create post
//router.post("/:id", upload.array("images", 5), PostController.createPost);
router.post("/:id", upload.array("images", 5), PostController.createPost);

// Update post
router.put(
  "/:id/:postId",
  upload.array("images", 5),
  PostController.updatePost
);

// Delete post
router.delete("/:id", PostController.deletePost);

module.exports = router;
