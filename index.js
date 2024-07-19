const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();
require("./configs/db");
const app = express();
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const invoiceRouter = require("./routes/invoice");

const port = process.env.PORT || 3005;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/invoices", invoiceRouter);
app.use("/users", userRouter);
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
