# SL BusTrack - Comprehensive System Architecture & Use Case Documentation

This document provides a granular view of the **SL BusTrack** ecosystem, detailing the interactions between high-performance clients, intelligent machine learning layers, and scalable cloud infrastructure.

## 🏗️ Detailed System Architecture

```mermaid
graph TD
    subgraph "Client Tier (Flutter / Dart)"
        subgraph "Passenger Ecosystem"
            PA[Passenger Application]
            P_Auth[Auth UI]
            P_Map[Real-time Map]
            P_ETA[ETA Dashboard]
            P_Rating[Rating System]
        end
        
        subgraph "Driver Ecosystem"
            DA[Driver Application]
            D_Trip[Trip Controller]
            D_Crowd[Crowd Monitor]
            D_NFC[NFC Auth Module]
            D_Alert[Emergency Trigger]
        end
        
        subgraph "Administrative Control"
            AA[Admin Web Dashboard]
            A_Monitor[Global Fleet View]
            A_Triage[Incident Priority List]
        end
    end

    subgraph "Cloud Infrastructure (Supabase / PostgreSQL)"
        S_Auth[GoTrue Authentication]
        S_DB[(PostgreSQL Primary)]
        S_Realtime[Realtime Location Engine]
        S_Edge[Edge Functions / REST API]
        
        subgraph "Data Schema"
            T_Users[Users / Drivers]
            T_Buses[Buses / Routes]
            T_Trips[Trip History]
            T_Locs[Location Logs]
            T_Alerts[Emergency Alerts]
        end
    end

    subgraph "Intelligence Tier (Neo - AI/ML)"
        subgraph "ETA Prediction Engine"
            ML_ETA[Random Forest / XGBoost]
            DS_ETA[bus_trips_dataset.csv]
            JOB_ETA[bus_arrival_model.joblib]
        end
        
        subgraph "Driver Performance Analysis"
            ML_Rating[Sentiment Classification]
            JOB_Rating[driver_rating_model.pkl]
        end
        
        subgraph "Automated Emergency Triage"
            ML_Triage[Priority Ranking Model]
            JOB_Triage[emergency_triage_model.joblib]
        end
    end

    %% Interactions
    PA -- "JWT Token" --> S_Auth
    PA -- "Listen" --> S_Realtime
    PA -- "Request Prediction" --> S_Edge
    
    DA -- "Start/Stop Trip" --> S_Edge
    DA -- "Broadcast GPS" --> S_Realtime
    DA -- "POST Crowd Data" --> S_DB
    
    S_Edge -- "Execute Query" --> S_DB
    S_DB -- "Read/Write" --> T_Users
    S_DB -- "Read/Write" --> T_Buses
    
    S_Edge -- "Trigger Analysis" --> ML_ETA
    S_Edge -- "Log Incident" --> ML_Triage
    
    ML_ETA -- "Historical Input" --> DS_ETA
    ML_Triage -- "Model Weights" --> JOB_Triage
    ML_Rating -- "Feedback Input" --> JOB_Rating
```

## 📋 Granular Use Case Diagram

```mermaid
useCaseDiagram
    actor "Passenger" as P
    actor "Driver" as D
    actor "Admin" as A
    actor "Intelligence Layer" as AI

    package "SL BusTrack Ecosystem" {
        usecase "Secure Authentication" as UC_Auth
        usecase "Real-time Fleet Tracking" as UC_Track
        usecase "Predictive ETA View" as UC_ETA
        usecase "NFC Driver Validation" as UC_NFC
        usecase "Crowd Density Reporting" as UC_Crowd
        usecase "Instant Emergency Broadcast" as UC_Alert
        usecase "Automated Incident Triage" as UC_Triage
        usecase "Driver Performance Rating" as UC_Rate
        usecase "Fleet & Route Management" as UC_Manage
        usecase "Resource Priority Allocation" as UC_Ops
    }

    P --> UC_Auth
    P --> UC_Track
    P --> UC_ETA
    P --> UC_Rate
    P --> UC_Alert

    D --> UC_Auth
    D --> UC_NFC
    D --> UC_Crowd
    D --> UC_Alert

    A --> UC_Auth
    A --> UC_Manage
    A --> UC_Ops

    AI -- "Provides Ranking" --> UC_Triage
    AI -- "Provides Estimates" --> UC_ETA
    
    UC_Alert ..> UC_Triage : <<include>>
    UC_Triage ..> UC_Ops : <<inform>>
```
