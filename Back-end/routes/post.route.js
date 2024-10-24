const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { PostController } = require("../controllers");

router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.post("/", PostController.createPost);
router.put("/:id", PostController.updatePost);
router.post("/upload", PostController.uploadImage);

module.exports = router;
