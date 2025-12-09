const express = require("express");
const router = express.Router();
const db = require("../db");
const axios = require("axios");

// Utility to build cover URLs
function getCoverUrl({ isbn, openlibrary_id }, size = "L") {
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
  }
  if (openlibrary_id) {
    return `https://covers.openlibrary.org/b/olid/${openlibrary_id}-${size}.jpg`;
  }
  return null;
}

/* ===========================
   INDEX (HOME PAGE)
=========================== */
router.get("/", async (req, res, next) => {
  try {
    const sort = req.query.sort || "created_at_desc";
    let orderSql = "created_at DESC";

    if (sort === "rating_desc") orderSql = "rating DESC, updated_at DESC";
    if (sort === "rating_asc") orderSql = "rating ASC, updated_at DESC";
    if (sort === "created_at_asc") orderSql = "created_at ASC";

    const result = await db.query(`SELECT * FROM books ORDER BY ${orderSql}`);
    res.render("index", { books: result.rows, sort });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   NEW BOOK FORM
=========================== */
router.get("/books/new", (req, res) => {
  res.render("new");
});

/* ===========================
   CREATE BOOK
=========================== */
router.post("/books", async (req, res, next) => {
  try {
    const { title, author, isbn, openlibrary_id, rating, review } = req.body;
    const cover_url = getCoverUrl({ isbn, openlibrary_id });

    const result = await db.query(
      `
      INSERT INTO books (title, author, isbn, openlibrary_id, cover_url, rating, review)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        title,
        author,
        isbn || null,
        openlibrary_id || null,
        cover_url,
        rating || 0,
        review || null,
      ]
    );

    res.redirect(`/books/${result.rows[0].id}`);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   SHOW BOOK DETAILS
=========================== */
router.get("/books/:id", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).send("Book not found");

    res.render("show", { book: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   EDIT FORM
=========================== */
router.get("/books/:id/edit", async (req, res, next) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id=$1", [
      req.params.id,
    ]);
    res.render("edit", { book: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   UPDATE BOOK
=========================== */
router.put("/books/:id", async (req, res, next) => {
  try {
    const { title, author, isbn, openlibrary_id, rating, review } = req.body;
    const cover_url = getCoverUrl({ isbn, openlibrary_id });

    await db.query(
      `
      UPDATE books SET
        title=$1,
        author=$2,
        isbn=$3,
        openlibrary_id=$4,
        cover_url=$5,
        rating=$6,
        review=$7,
        updated_at=NOW()
      WHERE id=$8
      `,
      [
        title,
        author,
        isbn,
        openlibrary_id,
        cover_url,
        rating,
        review,
        req.params.id,
      ]
    );

    res.redirect(`/books/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   DELETE BOOK
=========================== */
router.delete("/books/:id", async (req, res, next) => {
  try {
    await db.query("DELETE FROM books WHERE id=$1", [req.params.id]);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

/* ===========================
   API ROUTE (JSON Search)
=========================== */
router.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;

    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10`
    );

    const mapped = response.data.docs.map((d) => ({
      title: d.title,
      author: d.author_name?.[0] || null,
      isbn: d.isbn?.[0] || null,
      openlibrary_id: d.cover_edition_key || null,
    }));

    res.json({ results: mapped });
  } catch (err) {
    res.status(500).json({ error: "External API error" });
  }
});

/* ===========================
   FULL SEARCH PAGE
=========================== */
router.get("/search", async (req, res, next) => {
  try {
    const q = req.query.q;

    // 1️⃣ Local DB Search
    const dbResults = await db.query(
      `
      SELECT * FROM books
      WHERE LOWER(title) LIKE LOWER($1)
         OR LOWER(author) LIKE LOWER($1)
      `,
      [`%${q}%`]
    );

    // 2️⃣ OpenLibrary API Search
    const apiResponse = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=5`
    );

    const apiResults = apiResponse.data.docs.map((d) => ({
      title: d.title,
      author: d.author_name?.[0] || "Unknown",
      isbn: d.isbn?.[0] || null,
      openlibrary_id: d.cover_edition_key || null,
      cover_url: d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`
        : "/no-cover.png",
    }));

    res.render("search", {
      query: q,
      dbResults: dbResults.rows,
      apiResults,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
