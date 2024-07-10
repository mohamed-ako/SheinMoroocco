const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 3030; // Port for the backend server

app.use(bodyParser.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: true, // Note: TLS requires secure: true
  auth: {
    user: "mohamed.akkouh1@etu.uae.ac.ma",
    pass: "@Mohend192112",
  },
});

// Endpoint to send email
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Create email message
  const mailOptions = {
    from: "mohamed.akkouh1@etu.uae.ac.ma",
    to: "mohamedakkouh07@gmail.com",
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ success: "Email sent successfully" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
