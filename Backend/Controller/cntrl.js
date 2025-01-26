const User = require("../Model/login.js");
const blog = require("../Model/blog.js");
const AccessToken = require("../Middleware/accessToken.js");
const RefreshToken = require("../Middleware/refreshToken.js");
async function login(req, res) {
  const body = req.body;
  const user = await User.findOne({
    Email: body.email,
    Password: body.password,
  });
  if (!user) {
    return res.status(401).send({ message: "Invalid credentials" });
  }
  const accessToken = await AccessToken(user._id);
  const refreshToken = await RefreshToken(user._id);

  const updatedUser = await User.findByIdAndUpdate(user?._id, {
    last_login_date: new Date(),
  });

  const cookieOption = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("accessToken", accessToken, cookieOption);
  res.cookie("refreshToken", refreshToken, cookieOption);

  return res.send({
    message: "Login successfully",
    user,
    error: false,
    success: true,
    data: {
      accessToken,
      refreshToken,
    },
  });
}

async function blogify(req, res) {
  try {
    const { title, content } = req.body;
    const imageFile = req.files.image ? req.files.image[0] : null;
    const videoFile = req.files.video ? req.files.video[0] : null;

    const post = await blog.create({
      Title: title,
      Content: content,
      Photo: imageFile ? `/Uploads/${imageFile.filename}` : null,
      Video: videoFile ? `/Uploads/${videoFile.filename}` : null,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).send({ message: "Error creating post", error });
  }
}

async function deletePost(req, res) {
  try {
    const postId = req.params.id;
    const deletedPost = await blog.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).send({ message: "Post not found" });
    }

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).send({ message: "Error deleting post", error });
  }
}

module.exports = { login, blogify, deletePost };
