const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../backend/.env") });
const express = require("express");
const cors = require("cors");
const bookingRoutes = require("../backend/routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// API routes
app.use("/api", bookingRoutes);

// Fallback: serve index.html for any non-API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Fixora server running at http://localhost:${PORT}`);
});
