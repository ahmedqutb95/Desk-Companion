#include <Arduino.h>
#include <TFT_eSPI.h>
#include "Test01_Hello.h"

TFT_eSPI tft;

void setupDisplay()
{
    tft.init();
    tft.setRotation(0);

    displayText("Hello");
}

void loopDisplay()
{
}

void displayText(const char* text)
{
    tft.fillScreen(TFT_BLACK);

    tft.setTextDatum(MC_DATUM);
    tft.setTextColor(TFT_WHITE);

    tft.drawString(text, 120, 120, 4);
}