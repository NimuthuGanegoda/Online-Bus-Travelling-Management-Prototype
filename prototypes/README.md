# SL BusTrack - Integrated Prototype Hub

This directory contains the unified components of the **SL BusTrack** system, integrating the front-end applications, back-end logic, and AI/ML models into a single architectural ecosystem.

## 📁 System Structure

### [Backend](./backend) (Node.js & SQLite)
- **Admin Backend:** Orchestrates fleet management and route configurations.
- **Driver Backend:** Manages trip lifecycles and real-time crowd status.
- **Passenger Backend:** Provides localized data for bus tracking and user queries.

### [Frontend](./frontend) (Flutter & React)
- **Admin Dashboard (React):** A sleek, dark-themed command center for system oversight.
- **Passenger App (Flutter):** Real-time tracking and ETA prediction interface.
- **Driver App (Flutter):** Operational tool for trip management and emergency alerts.

### [AI Models](./ai_models) (Python & Neo)
- **ETA Engine:** Predicts bus arrival times using historical trip data.
- **Rating Classifier:** Analyzes driver performance through passenger feedback.
- **Triage Priority:** Automatically ranks emergency incidents for the admin panel.

## 🚀 Getting Started

### 1. Backend & Database
Each backend uses a local SQLite database (`admin.db`, `driver.db`, `passenger.db`).
```bash
cd backend/admin-app-backend && npm start
cd backend/driver-app-backend && npm start
cd backend/passenger-app-backend && npm start
```

### 2. Frontend
- **Web:** Navigate to `frontend/admin_app` and run `npm start`.
- **Mobile:** Open `frontend/passenger_app` or `frontend/driver_app` in your IDE and run on your emulator/device.

### 3. Intelligence Layer
Install requirements:
```bash
cd ai_models && pip install -r requirements.txt
```

---
*Created for Nimuthu.*
