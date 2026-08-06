AI Desk Companion
Dashboard V1 - Product Requirements Document
Overview

Dashboard V1 is a developer dashboard used to control and monitor the AI Desk Companion.

It is not the final desktop application.

Its purpose is to:

Test the communication between Desktop ↔ ESP32
Preview what is currently displayed on the TFT
Control productivity features
Simulate the companion before implementing the final desktop app

The dashboard will later evolve into a React application and finally into a Tauri desktop application.

Design Goals

The dashboard should feel like:

Minimal
Modern
Calm
Easy to read
Dark mode first

Avoid looking like an engineering control panel full of buttons.

Use rounded cards with generous spacing.

Technology

Version 1 must use:

HTML5
CSS3
Vanilla JavaScript

No framework.

No React.

No Bootstrap.

No Tailwind.

No jQuery.

Folder Structure
dashboard/

index.html

assets/

css/
    styles.css

js/
    app.js

    websocket.js
    protocol.js

    ui.js

    components/
        header.js
        preview.js
        theme.js
        message.js
        clock.js
        pomodoro.js
        prayer.js
        reminders.js
        tasks.js
        whitenoise.js
        eventlog.js

    state/
        dashboardState.js

    utils/
        helpers.js

Every section must live inside its own file.

Do NOT place all UI logic inside app.js.

Dashboard Sections
1. Header
Outputs
Connection Status
Current Character State
Current Screen
Current Ambient Theme
Inputs
Connect
Disconnect
2. Live Preview

Large circular preview of the TFT.

This is the centerpiece of the dashboard.

Screen modes:

Normal
Message
What's Next
Clock

Changing the screen immediately updates the preview.

3. Theme Section

Inputs

Theme selector

Font selector

These affect the preview.

4. Message Section

Inputs

Text field

Push button

Erase button

Scroll direction

Horizontal
Vertical
5. Clock Section

Inputs

Theme

Digital
Analog

Outputs

Clock preview.

6. Pomodoro Section

Inputs

Task name

Focus duration

Short break

Long break

Number of cycles

Buttons

Start
Pause
Resume
Reset

Outputs

Current cycle

Current phase

Remaining time

7. Prayer Section

Outputs only

Next prayer

Countdown

8. Health Reminder Section

Each reminder contains

Reminder text

Repeat interval

Countdown

Buttons

Pause

Resume

Delete

Add Reminder

9. Tasks Section

Each task contains

Task name

Duration

Buttons

Start

Pause

Done

Delete

Outputs

Remaining time

Task status

10. White Noise Section

Themes

Fire

Ocean

Leaves

Controls

Play

Pause

Volume

Timer

Outputs

Currently Playing

Remaining Time

11. Event Log

Shows

Outgoing messages

Incoming messages

Connection events

System events

Auto-scroll enabled.

Character

The dashboard never manually changes the character state.

Character states are automatic.

States

Idle
Thinking
Alert

Expressions

Blink
Look Left
Look Right
Smile
Curious
Alert
Display Priority

Highest priority

Alert

↓

Message

↓

Clock

↓

What's Next

↓

Normal

When an alert occurs it temporarily overrides the current screen before returning to it.

Communication

Use JSON messages.

Example

{
    "type":"display_text",
    "text":"Hello"
}

Future communication must remain backward compatible.

Future

Do not implement

Authentication
Accounts
Database
AI
React
Tauri
Plugins

Those belong to future milestones.