const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const cookieParser = require("cookie-parser");
const app = express();
const dotenv = require("dotenv").config();

const PORT = process.env.port || 4000;

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const { errorHandler, pageNotFound } = require("./middelwares/errorHandler");

dbConnect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use(pageNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
