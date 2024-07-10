const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3001;

// MySQL connection configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "darek",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Endpoint to fetch user data by username
app.get("/user/:username", (req, res) => {
  const { username } = req.params;

  // Fetch user details from the database using prepared statements
  const query = "SELECT * FROM user WHERE username = ?";
  const params = [username];
  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
