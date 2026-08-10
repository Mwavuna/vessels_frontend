Design a FULLY NATIVE MOBILE APP UI/UX in FIGMA for Android built using Jetpack Compose.

The app is called “Marine Engine Fault Monitoring System”.

IMPORTANT:
This MUST look and behave like a REAL MOBILE APPLICATION — NOT a web dashboard squeezed into a phone.
Use native Android mobile patterns, touch-friendly layouts, floating action buttons, bottom navigation, adaptive cards, pull gestures, sheets, and Compose-style Material 3 components.

The app is designed for maritime engineering students and marine technicians to monitor marine engine parameters, detect faults, trigger alarms, visualize engine conditions, and simulate engine behavior in real time.

========================================
APP GOAL
========

The app simulates marine engine monitoring and fault detection.

The system should:

* Simulate engine parameters
* Display real-time engine data
* Detect abnormal values
* Trigger alarms
* Display fault descriptions
* Suggest corrective actions
* Store fault history
* Visualize trends and analytics
* Support training simulations

The app should feel:

* Industrial
* Professional
* Futuristic
* Mission-critical
* Real-time
* Highly responsive
* Easy to use in low-light environments

========================================
DESIGN STYLE
============

STYLE DIRECTION:
Modern industrial control system mixed with futuristic maritime monitoring.

Visual inspiration:

* Tesla vehicle monitoring UI
* NASA telemetry systems
* Modern ship bridge displays
* Industrial IoT dashboards
* SCADA systems
* Android 15 Material You
* Samsung One UI depth and spacing

DO NOT make it look like:

* A website
* Bootstrap admin template
* Desktop software
* Generic analytics dashboard

========================================
DESIGN SYSTEM
=============

Create a COMPLETE design system for future Jetpack Compose implementation.

========================================
COLOR SYSTEM
============

Dark theme first (primary experience)

PRIMARY COLORS:

* Primary Navy: #071826
* Deep Ocean Blue: #0E2A47
* Cyan Accent: #00D1FF
* Alert Red: #FF4D4D
* Warning Orange: #FF9F43
* Success Green: #2ECC71
* Background Dark: #050B12
* Card Surface: #101A24
* Secondary Surface: #162433

LIGHT THEME:
Generate matching light theme automatically.

STATUS COLORS:

* Normal = Green
* Warning = Orange
* Critical = Red
* Offline = Gray
* Simulated = Cyan Glow

Use glowing effects ONLY for:

* Active alarms
* Critical engine state
* Live data indicators

========================================
TYPOGRAPHY
==========

Typography should match Material 3 and Jetpack Compose.

Use:

* Display Large
* Headline Medium
* Title Large
* Body Large
* Label Medium

Font suggestions:

* Inter
* Manrope
* SF Pro alternative
* IBM Plex Sans

Numbers and telemetry:
Use monospaced font for:

* RPM
* Temperature
* Pressure
* Sensor values
* Logs

========================================
SPACING SYSTEM
==============

Use 8dp spacing system:

* 4dp micro spacing
* 8dp small
* 16dp standard
* 24dp medium
* 32dp large

Rounded corners:

* Cards = 20dp
* Dialogs = 28dp
* Chips = 14dp

========================================
COMPONENTS TO DESIGN
====================

Create reusable components for:

* Telemetry cards
* Animated gauges
* Circular indicators
* Linear pressure bars
* Fault chips
* Alarm banners
* Live graph cards
* Sensor tiles
* Floating action buttons
* Bottom sheets
* Navigation rail
* Bottom navigation
* Top app bars
* Pull-to-refresh states
* Empty states
* Loading shimmer states
* Error states
* Success states
* Notification cards
* Interactive charts
* Timeline components
* Fault history items

========================================
JETPACK COMPOSE READY
=====================

The design system should be structured for:

* Material Theme extension
* Compose reusable components
* Semantic color naming
* Dynamic theming support
* Adaptive layouts
* State-driven UI
* Dark/light theme switching

Provide:

* Component variants
* Elevation levels
* State variants
* Pressed states
* Disabled states
* Loading states
* Animated transitions

========================================
BOTTOM NAVIGATION
=================

Use a mobile bottom navigation bar with 5 tabs:

1. Dashboard
2. Sensors
3. Faults
4. Analytics
5. Settings

Each tab should have:

* Filled active icon
* Outlined inactive icon
* Label text
* Smooth transition animation

========================================
SCREENS TO DESIGN
=================

========================================

1. SPLASH SCREEN
   ========================================

Include:

* Animated ship engine illustration
* Cyan glowing logo
* App name
* Loading telemetry animation

Tagline:
“Real-Time Marine Engine Intelligence”

========================================
2. LOGIN SCREEN
===============

Features:

* Mobile-first layout
* Biometrics option
* PIN login
* Email login
* Face unlock illustration
* Animated background particles

Quick login chips:

* Student
* Engineer
* Instructor

========================================
3. DASHBOARD SCREEN
===================

MOST IMPORTANT SCREEN.

Design a real-time engine monitoring dashboard.

Include:

* Engine health score
* RPM live gauge
* Temperature gauge
* Pressure indicators
* Fuel flow visualization
* Cooling system status
* Alarm summary
* Live engine animation
* Real-time graphs
* Engine mode selector
* Emergency shutdown button

Mock live values:

* RPM = 1450
* Temperature = 78°C
* Oil Pressure = 4.2 bar
* Fuel Flow = 220 L/h
* Cooling Flow = 80%

Include:

* Animated telemetry
* Pulse effects
* Live status dots

========================================
4. SENSOR DETAILS SCREEN
========================

Detailed sensor monitoring.

Sections:

* Temperature sensors
* Pressure sensors
* Flow sensors
* Exhaust sensors
* Lubrication sensors

Each sensor card should show:

* Live reading
* Historical graph
* Status
* Last update
* Sensor health

Include:

* Swipeable cards
* Expandable sections
* Interactive line charts

========================================
5. FAULT DETECTION SCREEN
=========================

Critical industrial alert interface.

Show:

* Active faults
* Severity levels
* Fault source
* Detection time
* Suggested corrective action
* Alarm state

Fault examples:

* Engine Overheating
* Low Lubricating Oil Pressure
* Cooling Pump Failure
* High Exhaust Temperature
* Overspeed Condition
* Fuel Leakage Risk

Each fault card should:

* Glow according to severity
* Have action buttons
* Expand for details

Add:

* Alarm siren animation
* Blinking warning state
* Emergency acknowledgment button

========================================
6. FAULT HISTORY SCREEN
=======================

Timeline-based fault logs.

Features:

* Search faults
* Filter by severity
* Date ranges
* Export logs
* Timeline view

Mock entries:

* “Cooling Pump Failure — Resolved”
* “High Jacket Water Temperature”
* “Overspeed Shutdown Triggered”

========================================
7. ANALYTICS SCREEN
===================

Beautiful mobile analytics UI.

Include:

* RPM trends
* Temperature trends
* Fault frequency
* Sensor uptime
* Predictive maintenance score
* AI prediction cards

Charts:

* Line charts
* Circular analytics
* Heat maps
* Comparison graphs

Use:

* Touch interactions
* Tooltip popups
* Animated chart transitions

========================================
8. ENGINE SIMULATOR SCREEN
==========================

Interactive engine simulator.

Allow user to:

* Increase RPM
* Simulate overheating
* Reduce oil pressure
* Trigger failures
* Adjust cooling flow

Use:

* Sliders
* Knobs
* Real-time engine visualization
* Animated state changes

Simulation modes:

* Training
* Real-time
* Emergency
* Automatic

========================================
9. SETTINGS SCREEN
==================

Include:

* Theme switching
* Notification controls
* Simulation settings
* Alarm sounds
* Sensor calibration
* Data refresh interval
* Account settings
* About system

========================================
10. NOTIFICATIONS SCREEN
========================

Modern industrial notification center.

Notification examples:

* “CRITICAL: Engine Temperature Above Threshold”
* “Cooling System Stable”
* “Oil Pressure Dropping”

Use:

* Swipe actions
* Priority grouping
* Animated icons

========================================
MICROINTERACTIONS
=================

Include:

* Gauge needle animation
* Live blinking indicators
* Card hover responses
* Pull refresh fluid animation
* Alarm pulse glow
* Smooth page transitions
* FAB morph animations
* Expand/collapse animations
* Graph loading animations

========================================
EMPTY STATES
============

Create beautiful empty states:

* No faults detected
* No notifications
* Sensors offline
* No analytics yet

========================================
LOADING STATES
==============

Design:

* Skeleton loaders
* Telemetry shimmer
* Animated graph placeholders
* Pulsing cards

========================================
MOBILE UX REQUIREMENTS
======================

STRICTLY MOBILE UI.

Must include:

* Safe area handling
* Thumb-friendly controls
* Reachability
* Portrait-first design
* Gesture navigation
* Bottom sheets
* FAB interactions
* Nested scrolling
* Haptic interaction ideas

========================================
FIGMA ORGANIZATION
==================

Organize Figma into:

1. Foundations
2. Design Tokens
3. Components
4. Variants
5. Mobile Screens
6. Flows
7. Prototypes
8. Dark Theme
9. Light Theme

========================================
DELIVERABLES
============

Generate:

* High-fidelity mobile UI
* Full mobile app flow
* Design system
* Reusable components
* Prototype interactions
* Mobile animations
* Realistic telemetry mock data
* Material 3 compatible layouts

Everything should feel production-ready for direct implementation in Jetpack Compose.

Use realistic maritime engineering terminology and industrial telemetry data throughout the UI.
