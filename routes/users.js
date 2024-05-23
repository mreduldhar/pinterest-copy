const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect(process.env.DB_URL).then(()=>{
  console.log("MongoDB connection successfully 😊")
}).catch((err)=>{
  console.log("Connection failed ☹️", err)
})

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fullName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  contact: {
    type: Number
  },
  profileImage: {
    type: String
  },
  password: {
    type: String
  },
  board: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    }
  ]

})

userSchema.plugin(plm)

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;