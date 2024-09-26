const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_ATLAS_URI, {})
  .then(() => {
    console.log("Database Connected.");
  })
  .catch((err) => {
    console.log("Error connecting to Database.", err);
  });
