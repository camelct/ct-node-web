if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const authRouter = require("./auth");

app.use(express.json());
app.use("/", authRouter);

app.listen(process.env.AUTH_PORT || 4000);
