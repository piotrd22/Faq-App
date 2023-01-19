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
const authRouter = require("./routes/authRoute");
const commentRoute = require("./routes/commentRoute");
const userRoute = require("./routes/userRoute");
const replyRoute = require("./routes/replyRoute");

app.use("/api/questions", questionRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentRoute);
app.use("/api/users", userRoute);
app.use("/api/replies", replyRoute);

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log("Connected with DB! :)");
});

app.listen(process.env.PORT, () => {
  console.log("Backend is alive!");
});
