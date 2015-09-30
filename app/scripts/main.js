import BooksCollection from 'models/books-collection';
import CreateBookView from 'views/books/create';

window.App = {};

$(document).ready(function(){
  App.books = new BooksCollection();

  window.createBookView = new CreateBookView();
  $('#container').append(createBookView.render().el);
  
});
