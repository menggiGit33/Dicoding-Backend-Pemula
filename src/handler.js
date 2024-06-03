/* eslint-disable const/extensions */
const { nanoid } = require ('nanoid');
const books = require ('./books.js');
const _ = require ('lodash');



const addBook = (req, h) => {
  const {
    name, year, 
    author, summary,
    publisher, pageCount,
    readPage, reading,
  } = req.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if(name==null) {
    const response = h.response(
      errResponse('fail', 'Gagal menambahkan buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
}

if(pageCount < readPage) {
    const response = h.response(
      errResponse('fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'),
     );
    response.code(400);
    return response;
}
    const newBook = {
        name, year, author, summary, publisher,
        pageCount, readPage, finished, reading, id,
        insertedAt, updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
        const response = h.response(
          {
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response(
      errResponse('fail', 'Buku gagal ditambahkan'),
    );
    response.code(500);
    return response;
};


const getAllBooksQuery = (query) => {
  let book;
  if (!_.isEmpty(query.reading)) {
    book = books.filter((b) => b.reading == query.reading);
  }
  if (!_.isEmpty(query.name)) {
    const regex = new RegExp(query.name, 'gi');
    book = books.filter((b) => b.name.match(regex));
  }
  if (!_.isEmpty(query.finished)) {
    book = books.filter((b) => b.finished == query.finished);
  }
  const isBookNull = _.isEmpty(book);
  if (!isBookNull) {
    return book.map((item) => {
      const { id, name, publisher } = item;
      return {
        id, name, publisher,
      };
    });
  }
  return false;
};

const getAllBooks = (req, h) => {
  const { query } = req;

  const isQueryNull = _.isEmpty(query);
  if (!isQueryNull) {
    const filteredBooks = getAllBooksQuery(query);
    if (!filteredBooks) {
      const res = h.response(
        errResponse('fail', 'Buku yang dicari tidak ditemukan'),
      );
      res.code(400);
      return res;
    }
    return {
      status: 'success',
      data: {
        books: filteredBooks,
      },
    };
  }

  const mappedBooks = books.map((item) => {
    const { id, name, publisher } = item;
    return {
      id, name, publisher,
    };
  });

  return {
    status: 'success',
    data: {
      books: mappedBooks,
    },
  };
};

const getBookById = (req, h) => {
  const { bookId } = req.params;
 
  const book = books.filter((n) => n.id === bookId)[0];
 
  if (book !== undefined) {
    const response = h.response(
      
      {
      status: "success",
      data: {
          book,
      },
  });
  response.code(200);
  return response;
}
 
  const response = h.response(
    errResponse('fail', 'Buku tidak ditemukan'),
  );
  response.code(404);
  return response;
};

const updateBookById = (req, h) => {
  const { bookId } = req.params;
  const {
    name, year, author,
    summary, publisher,
    pageCount, readPage, reading,
  } = req.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);
  if(name==null) {
    const response = h.response(
      errResponse('fail', 'Gagal memperbarui buku. Mohon isi nama buku'),
    );
    response.code(400);
    return response;
}

if(pageCount < readPage) {
    const response = h.response(
      errResponse('fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'),
     );
    response.code(400);
    return response;
}

  if (index !== -1) {
    
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
   
    const response = h.response(
      errResponse('fail', 'Gagal memperbarui buku. Id tidak ditemukan'),
    );
    response.code(404);
    return response;
    
  
  
};

const deleteBookById = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const res = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    res.code(200);
    return res;
  }

  const res = h.response(
    errResponse('fail', 'Buku gagal dihapus. Id tidak ditemukan'),
  );
  res.code(404);
  return res;
};

const errResponse = (status, message) => ({
  status,
  message,
});


module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
};
