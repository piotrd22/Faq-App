const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("common"));
app.use(helmet());

//ROUTES
const questionRouter = require("./routes/questionRoute");

app.use("/api/questions", questionRouter);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log("Connected with DB! :)");
});

app.listen(process.env.PORT, () => {
  console.log("Backend is alive!");
});
