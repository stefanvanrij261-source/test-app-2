const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve client folder
app.use(express.static(path.resolve(__dirname, "../client")));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
