const {
  getAllBooksHandler,
  createBookHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookById,
} = require("./handler")

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: createBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: updateBookByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookById,
  },
]

module.exports = routes
