import BooksCollection from 'models/books-collection';

window.App = {};

$(document).ready(function(){
  // prepend the contents of `app/templates/application.hbs` into `body`
  $('#container').append(JST.application());

  App.books = new BooksCollection();
});
