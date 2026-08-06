#include "display/Test01_Hello.h"
#include "NetworkManager.h"

#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ArduinoJson.h>

const char* ssid = "WE_5CAD9F";
const char* password = "e7bd61b4";

WebSocketsServer webSocket(81);

void webSocketEvent(uint8_t client,
                    WStype_t type,
                    uint8_t* payload,
                    size_t length)
{
    switch (type)
    {
        case WStype_CONNECTED:
        {
            Serial.println("Client Connected");
            break;
        }

        case WStype_DISCONNECTED:
        {
            Serial.println("Client Disconnected");
            break;
        }

        case WStype_TEXT:
        {
            Serial.print("Received: ");
            Serial.println((char*)payload);

            JsonDocument doc;

            DeserializationError error = deserializeJson(doc, payload);

            if (error)
            {
                Serial.println("Invalid JSON");
                return;
            }

            const char* type = doc["type"];

            if (strcmp(type, "display_text") == 0)
            {
                const char* text = doc["text"];

                Serial.print("Display: ");
                Serial.println(text);

                displayText(text);
            }

            break;
        }

        default:
            break;
    }
}

void setupNetwork()
{
    Serial.begin(115200);

    Serial.println();
    Serial.println("Connecting to WiFi...");

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("WiFi Connected!");

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    webSocket.begin();
    webSocket.onEvent(webSocketEvent);

    Serial.println("WebSocket Started");
}

void loopNetwork()
{
    webSocket.loop();
}