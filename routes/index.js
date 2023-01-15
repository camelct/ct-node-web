const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");

const Book = require("../models/book");
const initializePassport = require("../utils/passport-config");

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
);

router.get("/", async (req, res) => {
  let books;
  try {
    books = await Book.find().sort({ createAt: "desc" }).limit(10).exec();
  } catch (error) {
    books = [];
  } finally {
    res.render("index", { books });
  }
});

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

// router.get("/", authenticateToken, async (req, res) => {
//   const { name } = req.user;
//   res.json(posts.filter(post => post.username === name));
// });

const users = [
  {
    id: "1673692352488",
    name: "123",
    email: "admin@qq.com",
    password: "$2b$10$l1D/F7x1mBKt.kRAiIZM1uuZRYKEW7Fx.8W9YNjHQp9nJ6mrccZ.q",
  },
];

router.get("/login", checkNotAuthenticated, async (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
);

router.get("/register", checkNotAuthenticated, async (req, res) => {
  res.render("auth/register");
});

router.post("/register", checkNotAuthenticated, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    });

    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/");

  next();
}

module.exports = router;
