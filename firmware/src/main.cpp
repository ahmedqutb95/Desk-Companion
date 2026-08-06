#include <Arduino.h>

#include "display/Test01_Hello.h"
#include "NetworkManager.h"

void setup()
{
    setupDisplay();
    setupNetwork();
}

void loop()
{
    loopDisplay();
    loopNetwork();
}