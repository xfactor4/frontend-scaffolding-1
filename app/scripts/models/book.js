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
    if(_.isEmpty(attributes.title)){
      errors.title = "Must have a valid title";
    }
    if(_.isEmpty(attributes.author)){
      errors.author = "Must have a valid author";
    }
    return _.keys(errors).length ? errors : undefined;
  }
});

export default Book;
