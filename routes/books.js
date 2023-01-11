const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const fs = require("fs");

// const uploadPath = path.join("public", Book.coverImageBasePath);

const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });

// All Book Route
router.get("/", async (req, res) => {
  let query = Book.find();
  const { title, publishedBefore, publishedAfter } = req.query;
  if (title) {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }

  if (publishedBefore) {
    query = query.lte("publishDate", publishedBefore);
  }

  if (publishedAfter) {
    query = query.gte("publishDate", publishedAfter);
  }

  try {
    const books = await query.exec();
    res.render("books/index", {
      books,
      searchOptions: req.query,
    });
  } catch (error) {
    res.redirect("/");
  }
});

// New Book Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

// Create Book Route
// upload.single("cover")
router.post("/", async (req, res) => {
  const { title, author, publishDate, pageCount, description, cover } =
    req.body;
  // const fileName = req.file?.filename;

  const book = new Book({
    title,
    author,
    publishDate: new Date(publishDate),
    pageCount,
    description,
    // coverImageName: fileName,
  });

  saveCover(book, cover);

  try {
    const newBook = await book.save();
    // res.redirect(`books/${newBook.id}`)
    res.redirect("books");
  } catch (error) {
    // if (book.coverImageName) removeBookCover(book.coverImageName);
    renderNewPage(res, book, true);
  }
});

// function removeBookCover(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), err => {
//     if (err) console.error("err", err);
//   });
// }

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors,
      book,
    };
    if (hasError) params.errorMessage = "Error Creating Book";

    res.render("books/new", params);
  } catch (error) {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if (!coverEncoded) return;
  const cover = JSON.parse(coverEncoded);
  if (cover && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

module.exports = router;
