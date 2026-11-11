require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/violations", require("./routes/violationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

app.use((err, req, res, next) => {
  res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
