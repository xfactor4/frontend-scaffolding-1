var Book = Backbone.Model.extend({
  defaults: function(){
    return {
      title: "",
      author: "",
      thumbnail: "",
      genres: [],
      created_at: Date.now()
    }
  },

  validate: function(attributes) {
    var errors = {};
    if(!attributes.title.length){
      errors.title = "Must have a valid title";
    }
    if(!attributes.author.length){
      errors.author = "Must have a valid author";
    }
    return _.keys(errors).length ? errors : undefined;
  }
});

export default Book;
