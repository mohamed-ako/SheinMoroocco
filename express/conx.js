const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "darek",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

app.get("/id/:myid", (req, res) => {
  const { myid } = req.params;

  console.log("Fetching id details for:", myid);

  // Fetch user details from the database using prepared statements
  const query = "SELECT * FROM user WHERE id = ?";
  const params = [myid];
  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "id not found" });
    }
  });
});

app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;

  console.log("Fetching user details for:", username);

  try {
    // Fetch user details from the database using a prepared statement
    const query = "SELECT * FROM user WHERE username = ?";
    db.query(query, [username], (err, results) => {
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length > 0) {
        // Login successful
        return res.status(200).json({ message: "Login successful" });
      } else {
        // Login failed
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

app.post("/signup", (req, res) => {
  const user = req.body;

  if (!user.username || !user.password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.query("INSERT INTO user SET ?", user, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    return res.status(201).json({ message: "Registration successful" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
