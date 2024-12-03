#include <DHT.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>

// Replace with your network credentials
const char* ssid = "SSID of your Network";
const char* password = "Password";

// REPLACE with your Domain name and URL path or IP address with path
const char* serverName = "http://XXXX.example.com/";

// Keep this API Key value to be compatible with the PHP code provided in the project page.
String apiKeyValue = "API_Key";

#define DHTPIN     14      // Pin where the DHT11 is connected
#define DHTTYPE    DHT11   // DHT 11
#define MQ135_PIN  34      // Analog input pin for the MQ135 sensor's AO pin

DHT dht(DHTPIN, DHTTYPE); // Create a DHT object

void setup() {
  Serial.begin(115200);
  dht.begin(); // Initialize the DHT sensor

  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

float calculateCO2Concentration(int sensorValue) {
  // The MQ135 sensor's sensitivity characteristics for CO2 are not linear
  float CO2Concentration = (sensorValue * 0.0264) - 3.6; // Example calculation
  return CO2Concentration;
}

float calculateNH3Concentration(int sensorValue) {
  // The MQ135 sensor's sensitivity characteristics for NH3 are not linear
  float NH3Concentration = sensorValue * (5.0 / 1023.0); // Example calculation
  return NH3Concentration;
}

void loop() {
  // Check WiFi connection status
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected. Attempting to reconnect...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.println("Connected to WiFi");
  }

  // Reading temperature and humidity from DHT11
  int Humidity = dht.readHumidity();    // Read humidity
  float Temperature = dht.readTemperature(); // Read temperature as Celsius

  // Check if any reads failed and exit early (to try again).
  if (isnan(Humidity) || isnan(Temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Read the analog value from the MQ135 sensor's AO pin
  int sensorValue = analogRead(MQ135_PIN);

  // Calculate the CO2 and NH3 concentrations in ppm
  float CO2Concentration = calculateCO2Concentration(sensorValue);
  float NH3Concentration = calculateNH3Concentration(sensorValue);

  // Prepare your HTTP POST request data
  String httpRequestData = "api_key=" + apiKeyValue + "&Temperature=" + String(Temperature)
                           + "&Humidity=" + String(Humidity) + "&NH3=" + String(NH3Concentration)
                           + "&CO2=" + String(CO2Concentration);

  Serial.print("httpRequestData: ");
  Serial.println(httpRequestData);

  // Check if WiFi is connected before sending data
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client; // Create client on the stack
    client.setInsecure(); // Don't use SSL certificate
    HTTPClient https;

    // Your Domain name with URL path or IP address with path
    https.begin(client, serverName);

    // Specify content-type header
    https.addHeader("Content-Type", "application/x-www-form-urlencoded");

    // Send HTTP POST request
    int httpResponseCode = https.POST(httpRequestData);

    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    https.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

    // Check if any reads failed and exit early (to try again).
  if (isnan(Humidity) || isnan(Temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print the results to the Serial Monitor
  Serial.print("Humidity: ");
  Serial.print(Humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(Temperature);
  Serial.println(" *C");

  Serial.print("CO2 Concentration: ");
  Serial.print(CO2Concentration);
  Serial.println(" ppm");
  Serial.print("NH3 Concentration: ");
  Serial.print(NH3Concentration);
  Serial.println(" ppm");
  

}


void connectWiFi() {
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_STA);
  Serial.println(".");

  Serial.print("connected to:"); Serial.println(ssid);
  Serial.print("IP address:"); Serial.println(WiFi.localIP());
}
