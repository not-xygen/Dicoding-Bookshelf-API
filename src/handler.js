const { nanoid } = require("nanoid")
const books = require("./books")

const createBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload
  const finished = readPage === pageCount

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
  }

  const id = nanoid(16)
  const now = new Date().toISOString()
  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt: now,
    updatedAt: now,
  }

  books.push(book)

  return h
    .response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: { bookId: id },
    })
    .code(201)
}

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query

  let selectedBooks = books

  if (name) {
    selectedBooks = selectedBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()),
    )
  }

  if (reading) {
    selectedBooks = selectedBooks.filter(
      (book) => book.reading > 0 == (reading === "1"),
    )
  }

  if (finished) {
    selectedBooks = selectedBooks.filter(
      (book) => book.finished === (finished === "1"),
    )
  }

  const simplifiedBooks = selectedBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }))

  return h
    .response({
      status: "success",
      data: { books: simplifiedBooks },
    })
    .code(200)
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((b) => b.id === bookId)[0]

  if (book !== undefined) {
    return h
      .response({
        status: "success",
        data: {
          book,
        },
      })
      .code(200)
  }

  return h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404)
}

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload

  const bookIndex = books.findIndex((book) => book.id === bookId)

  if (bookIndex === -1) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Id tidak ditemukan",
      })
      .code(404)
  }

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400)
  }

  const finished = readPage === pageCount
  const updatedAt = new Date().toISOString()
  const insertedAt = books[bookIndex].insertedAt

  books[bookIndex] = {
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  }

  return h
    .response({
      status: "success",
      message: "Buku berhasil diperbarui",
    })
    .code(200)
}

const deleteBookById = (request, h) => {
  const { bookId } = request.params
  const checkId = books.findIndex((book) => book.id === bookId)

  if (checkId !== -1) {
    books.splice(checkId, 1)
    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200)
  }

  return h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404)
}

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookById,
}
