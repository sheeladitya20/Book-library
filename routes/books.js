const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const { Op } = require("sequelize");
// const verifyToken = require('../middleware/authMiddleware');
const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, "SECRETKEY", (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Attach the user ID to the request object for further use
    req.userId = decoded.userId;
    next();
  });
};

// Get All Books (protected route)
router.get("/getAllBooks", async (req, res) => {
  // Only authenticated users can access this route
  // Use req.userId to retrieve the user ID if needed

  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error("Error while retrieving books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/searchBooks",

  async (req, res) => {
    try {
      console.log("reqqqq1", req.body.author);
      // Handle the request and validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const book = await Book.findAll({
        where: {
          [Op.or]: {
            author: {
              [Op.like]: `%${req.body.searchBy}%`,
            },
            title: {
              [Op.like]: `%${req.body.searchBy}%`,
            },
            description: {
              [Op.like]: `%${req.body.searchBy}%`,
            }
          },
        },
      });
      res.send(book);
    } catch (err) {
      res.send("error");
    }

    // Continue with creating the book
    // ...
  }
);

// sorting and filtering with getting all books

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of books per page
  const sortField = req.query.sortBy || "title"; // Field to sort by (default: title)
  const sortOrder = req.query.sortOrder || "asc"; // Sort order (asc or desc)
  const filterByAuthor = req.query.author || ""; // Author filter

  try {
    const filterOptions = {};
    if (filterByAuthor) {
      filterOptions.author = { [Op.like]: `%${filterByAuthor}%` };
    }

    const { count, rows } = await Book.findAndCountAll({
      where: filterOptions,
      order: [[sortField, sortOrder]],
      offset: (page - 1) * limit,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      page,
      totalPages,
      totalCount: count,
      books: rows,
    });
  } catch (error) {
    console.error("Error while retrieving books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByPk(bookId);

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Error while retrieving the book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const { title, author, description } = req.body;

  try {
    const newBook = await Book.create({ title, author, description });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error while creating the book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, description } = req.body;

  try {
    const book = await Book.findByPk(bookId);

    if (book) {
      // Update the book with the new data
      await book.update({ title, author, description });
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Error while updating the book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findByPk(bookId);

    if (book) {
      // Delete the book from the database
      await book.destroy();
      res.json({ message: "Book deleted successfuly!!!" });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error("Error while deleting the book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Pagination limit 1-10

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of books per page

  console.log("herereeee");
  try {
    const { count, rows } = await Book.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      page,
      totalPages,
      totalCount: count,
      books: rows,
    });
  } catch (error) {
    console.error("Error while retrieving books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

(module.exports = router), verifyToken;
