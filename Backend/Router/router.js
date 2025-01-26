const { login, blogify, deletePost } = require("../Controller/cntrl");
const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../Middleware/auth.js");
const blog = require("../Model/blog.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Uploads")); // Ensure the path is relative to this file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/user", login);

router.post(
  "/blog",
  upload.fields([{ name: "image" }, { name: "video" }]),
  blogify
);

router.get("/blogData", async (req, res) => {
  const data = await blog.find({});
  res.json(data);
});

router.delete("/deletepost/:id", deletePost);

module.exports = router;
