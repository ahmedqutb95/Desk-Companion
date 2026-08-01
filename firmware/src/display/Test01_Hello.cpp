#include <Arduino.h>
#include <TFT_eSPI.h>
#include "Test01_Hello.h"

TFT_eSPI tft;

void setupDisplay()
{
    tft.init();
    tft.setRotation(0);

    tft.fillScreen(TFT_BLACK);

    tft.setTextDatum(MC_DATUM);
    tft.setTextColor(TFT_WHITE);

    tft.drawString("Hello", 120, 120, 4);
}

void loopDisplay()
{
}