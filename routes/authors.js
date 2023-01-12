const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

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
    res.redirect(`authors/${newAuthor.id}`);
  } catch (error) {
    res.render("authors/new", {
      author,
      errorMessage: "Error Creating Author",
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findById(id);
    const books = await Book.find({ author: author.id }).limit(6).exec();

    res.render("authors/show", {
      author,
      booksByAuthor: books,
    });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  try {
    const author = await Author.findById(id);
    res.render("authors/edit", { author });
  } catch (error) {
    res.redirect("/authors");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  let author;
  try {
    author = await Author.findById(id);

    author.name = name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (error) {
    if (!author) {
      // 没查找到
      res.redirect("/");
      return;
    }

    // 保存失败 回去继续编辑
    res.render("authors/edit", {
      author,
      errorMessage: "Error Updating Author",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  let author;
  try {
    author = await Author.findById(id);
    await author.remove();
    res.redirect("/authors");
  } catch (error) {
    if (!author) {
      // 没查找到
      res.redirect("/");
      return;
    }

    // 保存失败 回去继续编辑
    res.redirect(`/authors/${author.id}`);
  }
});

module.exports = router;
