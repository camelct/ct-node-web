const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

router.get("/", authenticateToken, async (req, res) => {
  const { name } = req.user;
  res.json(posts.filter(post => post.username === name));
});

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  let token;
  if (authHeader) {
    [_, token] = authHeader.split(" ");
  }

  // 401 没有传token
  if (!token) return res.sendStatus(401);

  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    // 这个token失效了， 403 没有权限
    return res.sendStatus(403);
  }
}

module.exports = router;
