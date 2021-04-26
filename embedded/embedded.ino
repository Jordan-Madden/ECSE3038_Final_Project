#include <Wire.h>
#include <MPU6050.h>
#include <SoftwareSerial.h>

#define DEBUG true
#define LM35 A0

MPU6050 mpu;
SoftwareSerial esp(10, 11);

// Timers
unsigned long timer = 0;
float timeStep = 0.01;

// Pitch, Roll and Yaw values
float pitch = 0.0;
float roll = 0.0;
float yaw = 0.0;

void espSetup(){
  String networkName = "FLOW-WiFi";
  String networkPassword = "Honeymad5";
  
  // Reset the esp in case of power outage
  sendData("AT+RST\r\n", 10000, DEBUG);
  
  // Configure ESP to operate as client
//  sendData("AT+CWMODE=3\r\n", 10000, DEBUG);

  // List access points
//  sendData("AT+CWLAP\r\n", 10000, DEBUG);

  // Join an access point
  sendData("AT+CWJAP=\"FLOW-WiFi\",\"Honeymad5\"\r\n", 5000, DEBUG);

  // Verify that access point has been joined
//  sendData("AT+CIFSR\r\n", 3000, DEBUG);  
}

void gyroscopeSetup(){
  while(!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G))
  {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }
  
  // Calibrate gyroscope. The calibration must be at rest.
  // If you don't want calibrate, comment this line.
  mpu.calibrateGyro();

  // Set threshold sensivty. Default 3.
  // If you don't want use threshold, comment this line or set 0.
  mpu.setThreshold(0);  

  Serial.println("MPU6050 Ready!");
  delay(1500);
}

void readGyroscope(){
  timer = millis();
  
  // Read normalized values
  Vector norm = mpu.readNormalizeGyro();

  // Calculate Pitch, Roll and Yaw
  pitch = pitch + norm.YAxis * timeStep;
  roll = roll + norm.XAxis * timeStep;
  yaw = yaw + norm.ZAxis * timeStep;  

  // Wait to full timeStep period
  delay((timeStep*1000) - (millis() - timer));
}

float getTemperature(){
  float voltage, temp;

  // Read temperature from the LM35 sensor
  voltage = analogRead(LM35) * (5.0/1023.0);
  temp = 100 * voltage;

  return temp;
}

String sendData(String command, const int timeout, boolean debug) {
    String response = "";
    
    Serial1.print(command); // send the read character to the esp8266
    
    unsigned long time = millis();
    
    while( (time+timeout) > millis())
    {
      while(Serial1.available())
      {
        
        // The esp has data so display its output to the serial window 
        char c = Serial1.read(); // read the next character.
        response += c;
      }  
    }
    
    if(debug)
    {
      Serial.print(response);
    }
    
    return response;
}

String generatePostRequest(String route, String portNumber, int cLength, String pData) {
  String requestType = "POST /" + route + " HTTP/1.1\r\n";
  String hostInfo = "Host: 192.168.1.7:" + portNumber + "\r\n";
  String contentType = "Content-Type: application/json\r\n";
  String contentLength = "Content-Length: " + String(cLength) + "\r\n\r\n";
  String postData = pData + "\r\n\r\n";

  return requestType + hostInfo + contentType + contentLength + postData;
}

String generateCIPSend(int requestLength){
  String cipSend = "AT+CIPSEND=" + String(requestLength) + "\r\n";
  
  return cipSend;
}

String generatePost(int patient_id, float pos, int temp){
  String post = "{\"patient_id\":" +String(patient_id)+ ", \"position\":" +String(pos)+ ", \"temperature\":"+String(temp)+"}\r\n\r\n";
  
  return post;
}

void setup() {
  Serial.begin(115200);
  Serial1.begin(115200);

  // Setup the gyroscope
  //gyroscopeSetup();

  sendData("AT+RST", 5000, DEBUG);

  // Setup the ESP8266
  espSetup();
}

void loop() {  
  sendData("AT+CIPSTART=\"TCP\",\"192.168.1.7\",5000\r\n", 1500, DEBUG);

  String postData = "{\"patient_id\": \"156\", \"position\": 273, \"temperature\": 35}";
  String postRequest = generatePostRequest("data", "5000", postData.length(), postData);  
  String CIPSend = generateCIPSend(postRequest.length());

  Serial.println(postData);

  sendData(CIPSend, 1000, DEBUG);
  sendData(postRequest, 5000, DEBUG);

//  readGyroscope();
//
//  int temp = getTemperature();
//
//  Serial.print("Yaw: "); Serial.print(yaw);
//  Serial.print("\tPitch: "); Serial.print(pitch);
//  Serial.print("\tRoll: "); Serial.println(roll);
//  Serial.print("Temperature: "); Serial.println(temp);

  delay(500);
}
