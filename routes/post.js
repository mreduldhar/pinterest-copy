const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  }

})

const postModel = mongoose.model('Post', postSchema)

module.exports = postModel;