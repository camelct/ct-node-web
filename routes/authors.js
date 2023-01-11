const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// All Authors Route
router.get("/", async (req, res) => {
  const searchOptions = {};
  const { name } = req.query;
  if (name) {
    searchOptions.name = new RegExp(name, "i");
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors, searchOptions: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

// New Author Route
router.get("/new", (req, res) => {
  res.render("authors/new", {
    author: new Author(),
  });
});

// Create Author Route
router.post("/", async (req, res) => {
  const { name } = req.body;

  const author = new Author({
    name,
  });

  try {
    const newAuthor = await author.save();
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect("authors");
  } catch (error) {
    res.render("authors/new", {
      author,
      errorMessage: "Error Creating Author",
    });
  }
});

module.exports = router;
