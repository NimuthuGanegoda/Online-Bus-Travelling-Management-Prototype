# SL BusTrack - Architectural & Functional Documentation

This document contains the core diagrams for the **SL BusTrack** system, a smart city public transport and emergency response platform.

## System Architecture Diagram

```mermaid
graph TD
    subgraph "Clients (Flutter Applications)"
        PA[Passenger App]
        DA[Driver App]
        AA[Admin App]
    end

    subgraph "Infrastructure Layer (Supabase)"
        Auth[Supabase Auth]
        DB[(PostgreSQL Database)]
        Realtime[Supabase Realtime]
        Functions[Edge Functions]
    end

    subgraph "Intelligence Layer (Neo - Python/Node.js)"
        ML_ETA[Bus Arrival ETA Model]
        ML_RATING[Driver Performance Rating]
        ML_TRIAGE[Emergency Incident Triage]
    end

    %% Client Interaction
    PA -- "Auth / Profile / Tracking" --> Auth
    PA -- "Real-time Location Updates" --> Realtime
    PA -- "Fetch Predictions / ETA" --> Functions

    DA -- "Manage Trip / Crowd Data" --> Functions
    DA -- "Trigger Emergency Alerts" --> Realtime

    AA -- "System Dashboard / Admin" --> DB
    AA -- "Prioritize Emergencies" --> Functions

    %% Data Flow
    Functions -- "Query / Insert" --> DB
    Functions -- "Analyze" --> ML_ETA
    Functions -- "Analyze" --> ML_RATING
    Functions -- "Analyze" --> ML_TRIAGE

    ML_ETA --- DB
    ML_RATING --- DB
    ML_TRIAGE --- DB
```

## Use Case Diagram

```mermaid
useCaseDiagram
    actor "Passenger" as P
    actor "Driver" as D
    actor "Admin" as A

    package "SL BusTrack System" {
        usecase "Login / Register" as UC1
        usecase "Track Bus Location" as UC2
        usecase "View Bus ETA" as UC3
        usecase "Rate Driver" as UC4
        usecase "Submit Emergency Alert" as UC5

        usecase "Start / End Trip" as UC6
        usecase "Update Crowd Status" as UC7
        usecase "Manage Bus Route" as UC8

        usecase "Monitor All Buses" as UC9
        usecase "Manage Drivers / Routes" as UC10
        usecase "Respond to Emergencies" as UC11
    }

    P --> UC1
    P --> UC2
    P --> UC3
    P --> UC4
    P --> UC5

    D --> UC1
    D --> UC6
    D --> UC7
    D --> UC8
    D --> UC5

    A --> UC1
    A --> UC9
    A --> UC10
    A --> UC11
```
