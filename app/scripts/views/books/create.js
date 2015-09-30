var CreateBookView = Backbone.View.extend({

  tagName: 'form',
  className: 'create-book',

  template: JST['books/create'],

  events: {
    'submit': 'createBook'
  },

  render: function(){
    this.$el.html(this.template());
    return this;
  },

  createBook: function(e) {
    e.preventDefault();
    App.books.create(this.serializeForm());
  },

  serializeForm: function() {
    var result = {};
    var inputs = this.$el.serializeArray();
    inputs.forEach(function(input) {
      result[input.name] = input.value;
    });
    return result;
  }

});

export default CreateBookView;
