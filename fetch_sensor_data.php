<?php
$servername = "your database host"; // Replace with your database host
$dbname = "your database name"; // Replace with your database name
$username = "your database username"; // Replace with your database username
$password = "your database password"; // Replace with your database password

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch data
$sql = "SELECT `ID`, `DateTime`, `Temperature`, `Humidity`, `NH3`, `CO2` FROM `sensors_db` ORDER BY ID DESC";
$result = $conn->query($sql);

// Check for query errors
if (!$result) {
    die("Query failed: " . $conn->error);
}

// Store data in an array
$sensorData = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $sensorData[] = $row; // Store each row in the array
    }
}

$conn->close();
?>
