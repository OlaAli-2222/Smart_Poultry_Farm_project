<?php
// Set the content type to JSON
header("Content-Type: application/json");

// Database connection parameters
$servername = "xxxx"; // Change this if your database server is different
$username = "xxxx"; // Your database username
$password = "xxxx"; // Your database password
$dbname = "xxxx"; // Your database name
$api_key_value = "API Key"; // Your API key

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]));
}

// Log incoming data for debugging
file_put_contents('log.txt', print_r($_POST, true), FILE_APPEND);

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the data from the POST request
    $api_key = isset($_POST['api_key']) ? $_POST['api_key'] : '';
    $temperature = isset($_POST['Temperature']) ? $_POST['Temperature'] : '';
    $humidity = isset($_POST['Humidity']) ? $_POST['Humidity'] : '';
    $nh3 = isset($_POST['NH3']) ? $_POST['NH3'] : '';
    $co2 = isset($_POST['CO2']) ? $_POST['CO2'] : '';

    Optional: Validate the API key
    if ($api_key !== $api_key_value) {
        echo json_encode(["status" => "error", "message" => "Invalid API key"]);
        exit;
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO sensors_db (DateTime, Temperature, Humidity, NH3, CO2) VALUES (NOW(), ?, ?, ?, ?)");
    $stmt->bind_param("dddd", $temperature, $humidity, $nh3, $co2); // "dddd" means four double values

    // Execute the statement
    if ($stmt->execute()) {
        // Log the received data (optional)
        $log_entry = "API Key: $api_key, Temperature: $temperature, Humidity: $humidity, NH3: $nh3, CO2: $co2\n";
        file_put_contents('data_log.txt', $log_entry, FILE_APPEND);

        // Respond back to the ESP32
        echo json_encode(["status" => "success", "message" => "Data received and inserted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error inserting data: " . $stmt->error]);
    }

    // Close the statement
    $stmt->close();
} else {
    // If not a POST request, return an error
    echo json_encode(["status" => "error", "message" => "No data received."]);
}

// Close the database connection
$conn->close();
?>
