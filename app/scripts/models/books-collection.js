import Book from 'models/book';

var BooksCollection = Backbone.Collection.extend({
  model: Book,
  url: "http://tiny-lasagna-server.herokuapp.com/collections/books"
});

export default BooksCollection;
