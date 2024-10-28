const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { PostController } = require("../controllers");

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.post("/", PostController.createPost);
router.put("/:id", PostController.updatePost);
// Get all posts
router.get("/", PostController.getAllPosts);

// Get post by id
router.get("/:id", PostController.getPostById);

// Create post
router.post("/", PostController.createPost);

// Update post
router.put("/:id", PostController.updatePost);

// Upload image
router.post("/upload", PostController.uploadImage);

module.exports = router;
