require("express-async-errors");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/connect");
const errorHandler = require("./middlewares/error-handler");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications-global"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
