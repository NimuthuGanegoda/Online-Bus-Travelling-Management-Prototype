# Smart City Management System: Public Transport and Emergency Response

This project is a comprehensive system designed to improve public transportation and emergency response within a smart city framework. It consists of two main parts: a public transport management system with passenger and driver applications, and an intelligent emergency triage system. The "Sarasi" component provides the frontend applications, while the "Neo" component contains the backend logic and machine learning models.

## Features

### Sarasi - Frontend Applications

The frontend is built using Flutter and consists of two separate applications:

*   **Passenger App:**
    *   **Real-time Bus Tracking:** View the live location of buses.
    *   **ETA Prediction:** Get accurate estimates for bus arrival times.
    *   **Bus Rating:** Rate and review bus services.
    *   **Emergency Alerts:** Send and receive emergency alerts.
    *   **Trip History:** View past trips and journey details.
    *   **User Profile:** Manage user information.

*   **Driver App:**
    *   **Trip Management:** Start, end, and manage bus trips.
    *   **NFC Integration:** For driver authentication or passenger interaction.
    *   **Passenger Crowd Monitoring:** View and report passenger crowd levels.
    *   **Emergency Alert System:** Receive and respond to emergency alerts.

### Neo - Backend and Machine Learning Models

The backend and ML models are developed using Python and Node.js.

*   **Arrival Time Estimation:** A machine learning model (`bus_arrival_model.joblib`) that predicts bus arrival times based on historical trip data (`bus_trips_dataset.csv`).
*   **Bus Rating System:** A classification model (`driver_rating_model.pkl`) to analyze and categorize bus ratings.
*   **Emergency Triage System:** An intelligent system to prioritize and rank emergency incidents based on severity.

## Technology Stack

*   **Frontend:** `Flutter`, `Dart`
*   **Backend & ML:** `Python`, `Node.js`, `Scikit-learn`, `Pandas`
*   **Database:** `SQLite`

## Project Structure

```
.
├── Neo/                                # Backend services and ML models
│   ├── Protype models/
│   │   ├── Arrival time estimation/    # Bus ETA prediction model
│   │   ├── Bus rating/                 # Bus rating classification model
│   │   └── emergency list prioritizing/  # Emergency triage model
│
└── Sarasi/                             # Frontend applications
    ├── Frontend/
    │   ├── driver_app/                 # Flutter app for drivers
    │   └── passenger_app/              # Flutter app for passengers
```

## Emergency Triage System

The emergency triage system is a critical component of the "Neo" backend. It uses a machine learning model (`emergency_triage_model.joblib`) to assign a priority score to incoming emergency reports. The system considers various factors to assess the severity of an incident.

### Triage Factors:

*   `emergency_type`: The nature of the emergency (e.g., `active_fire_with_trapped`, `chemical_spill`, `minor_injury`).
*   `num_victims`: The number of people affected.
*   `victim_age_group`: The age group of the victims (`child`, `teen`, `adult`).
*   `location_type`: The type of location (`residential`, `commercial`, `industrial`, `outdoor`).
*   `minutes_since_report`: The time elapsed since the incident was reported.
*   `caller_panic_level`: The panic level of the person reporting the incident (1-10).
*   And other boolean factors like `fire_involved`, `hazmat_involved`, `weapon_involved`, `unconscious_victim`, `severe_bleeding`, `trapped_victims`.

### Example Incidents:

The system can handle a wide range of emergencies, from minor incidents to life-threatening situations.

*   **High Priority:**
    *   `INC-005: Active shooter in shopping mall, multiple injured`
    *   `INC-006: House fire, family of 4 trapped on second floor`
    *   `INC-003: Chemical tank ruptured at factory, workers exposed`

*   **Medium Priority:**
    *   `INC-008: Drowning at public pool, child unresponsive`

*   **Low Priority:**
    *   `INC-004: Teen fell off bike, scraped knee`
    *   `INC-007: Car windshield smashed in parking lot`
