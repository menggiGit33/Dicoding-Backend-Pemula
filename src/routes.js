/* eslint-disable import/extensions */
const{
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
} = require( './handler.js');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookById,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookById,
  },
];

module.exports = routes;
