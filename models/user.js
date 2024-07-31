const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      minlength: [3, "Name must be atleast 3 character long"],
    },
    email: {
      type: String,
      required: "Email is required",
      match: /.+\@.+\..+/,
      unique: true,
    },
    image: {
      type: String,
      default: "images/users/default.jpg",
    },
    phoneNumber: {
      type: String,
      default:"",
    },
    city: {
      type: String,
      default:"",
    },
    state: {
      type: String,
      default:"",
    },
    address: {
      type: String,
      default:"",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
