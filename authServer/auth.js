const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

// 这个一般放在 database 或者 redis
let refreshTokens = [];

router.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  console.log("req.body", req.body);
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  try {
    const user = await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const accessToken = generateAccessToken({ user: user.name });
    res.json({ accessToken });
  } catch (error) {
    return res.sendStatus(403);
  }
});

// secret
// require('crypto').randomBytes(64).toString('hex')
router.post("/login", async (req, res) => {
  const { username } = req.body;
  const user = { name: username };
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

function generateAccessToken(user) {
  // m:minute s:second h:hour d:day
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

module.exports = router;
