const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: "localhost", // Adjust this if using an external MySQL server
    user: "root",      // Database username
    password: "",      // Database password
    database: "smartpoultryfarm", // Database name
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err);
    } else {
        console.log("Successfully connected to the database!");
    }
});

// Endpoint to insert data
app.post("/addData", (req, res) => {
    const { Temperature, Humidity } = req.body; // Data from the request
    const sql = "INSERT INTO sensors_db (Temperature, Humidity) VALUES (?, ?)";

    db.query(sql, [Temperature, Humidity], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error while inserting data.");
        } else {
            res.send("Data inserted successfully!");
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
