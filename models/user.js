const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    password: {
      type: String,
      required: "Password is required",
      minlength: [6, "Password must be atleast 6 character long"],
    },
    image: {
      type: String,
      default: "images/users/default.jpg",
    },
    phoneNumber: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    // Check if the password is being modified
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      image: this.image,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

module.exports = mongoose.model("users", userSchema);
