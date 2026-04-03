# Bus Arrival Time Estimation System

A Node.js + XGBoost ML pipeline for predicting bus arrival times with real-time data processing.

## 📋 Overview

This system integrates:
- **Node.js**: Main application & CLI interface
- **XGBoost**: Pre-trained ML model for ETA prediction
- **Python**: Model inference engine (joblib + xgboost)
- **CSV Processing**: Batch trip data handling with manual parsing (zero external dependencies)

## 🚀 Quick Start

### Prerequisites
- Node.js v24.14.0+ (installed)
- Conda environment: `eta_env` (Python 3.10 with xgboost, pandas, joblib)

### Single Trip Prediction
```powershell
cd 'c:\Users\Neo red\OneDrive\Desktop\Protype models\Arrival time estimation'
node .\eta_service.js
```

**Output Example:**
```
✅ Real-time ETA: 10.8 minutes
```

### Batch Processing (All 20 Scenarios)
```powershell
$env:PYTHONPATH=''; node .\eta_service.js --batch
```

**Output:**
- Console: 20 predictions with trip details (distance, traffic, weather, passengers, driver rating)
- File: `eta_predictions.json` with structured results

### Help
```powershell
node .\eta_service.js --help
```

## 📁 Project Structure

```
.
├── eta_service.js                 # Main Node.js service (batch + single prediction)
├── model/
│   ├── app.js                     # (Legacy) Express server
│   ├── predict_arrival.py         # Python XGBoost inference engine
│   ├── bus_arrival_model.joblib   # Pre-trained XGBoost model
│   └── model_features.joblib      # Feature configuration
├── bus_trips_dataset.csv          # 20 test trip scenarios
├── eta_predictions.json           # Results (generated after batch run)
├── package.json                   # Node.js dependencies
├── setup_db.js                    # (Legacy) Database initialization
└── .venv                          # Python virtual environment
```

## 🔧 Configuration

### Python Environment
- **Location:** `D:\Anaconda\envs\eta_env\python.exe`
- **Packages:** xgboost (3.2.0), pandas (2.3.3), joblib (1.5.3), numpy (2.0.1)
- **Setup Command:** (Already configured)

### Model Features (13 Required)
The XGBoost model expects these exact features:
1. `distance_to_stop_km` (float) - Distance to destination
2. `traffic_density` (float, 0-1) - Traffic level
3. `weather_score` (float, 0-1) - Weather quality
4. `passenger_count` (int) - Current passengers
5. `is_bus_full` (binary, 0/1) - At capacity flag
6. `driver_rating` (float, 0-5) - Driver performance rating
7-13. `route_id_SL-001` through `route_id_SL-007` (binary, one-hot encoding) - Route identification

## 📊 Test Data

`bus_trips_dataset.csv` contains 20 realistic scenarios:
- **Ideal conditions:** TRIP-014 (1km, 10% traffic, 95% weather, empty)
- **Worst case:** TRIP-007 (6.5km, 95% traffic, 40% weather, full)
- **Mixed scenarios:** 18 variations covering different conditions

### Sample Results (from last batch run)
| Trip ID | Distance | Traffic | Weather | Passengers | ETA (min) |
|---------|----------|---------|---------|------------|-----------|
| TRIP-002 | 1.5 km | 25% | 95% | 8 | 1.2 |
| TRIP-003 | 5.8 km | 85% | 50% | 45 | 18.0 |
| TRIP-007 | 6.5 km | 95% | 40% | 50 | 20.8 |
| TRIP-014 | 1.0 km | 10% | 95% | 6 | 0.1 |

## 🔄 Data Flow

```
Node.js (eta_service.js)
    ↓
CSV Parser → Trip Object
    ↓
Child Process: Python Spawn
    ↓
Python (predict_arrival.py)
    ↓
XGBoost Model Inference
    ↓
JSON Result → Node.js
    ↓
Console Display + JSON Export
```

## ⚙️ Technical Details

### Model Loading (Python)
```python
import joblib
model = joblib.load('bus_arrival_model.joblib')
features = joblib.load('model_features.joblib')
```

### Prediction Flow
1. **Input:** JSON via stdin with 13 feature values
2. **Processing:** XGBoost predicts ETA based on trained model
3. **Output:** JSON `{"eta_minutes": <float>}` or `{"error": "<msg>"}`

### Error Handling
- **Python errors:** Clear JSON error messages returned to Node
- **Missing features:** Validation ensures all 13 features present
- **CSV parsing:** Graceful fallback to demo data
- **Process failures:** Try/catch with detailed error logging

## 🐛 Troubleshooting

### Issue: "cannot import numpy" / "DLL load failed"
**Solution:** Clear PYTHONPATH before running
```powershell
$env:PYTHONPATH=''
node .\eta_service.js --batch
```

### Issue: "MODULE_NOT_FOUND" errors
**Solution:** Ensure Node.js dependencies installed
```powershell
npm install
```

### Issue: Python not found / Script not found
**Solution:** Verify paths in `eta_service.js` line 14-17:
- `pythonPath`: Points to conda environment
- `scriptPath`: Points to `predict_arrival.py`
- `csvPath`: Points to `bus_trips_dataset.csv`

## 📈 Performance Metrics

**Last Batch Run (20 trips):**
- ✅ Success Rate: 100%
- ⏱️ Average ETA: 9.4 minutes
- 🏃 Shortest ETA: 0.1 minutes (ideal conditions)
- 🐢 Longest ETA: 20.8 minutes (worst conditions)

## 🔐 Notes

- **No external npm dependencies** - CSV parsing uses built-in modules only
- **Manual CSV parsing** - Avoids npm bloat for simple use case
- **Python isolation** - Uses explicit environment path (not global Python)
- **JSON communication** - stdin/stdout for process-safe data exchange
- **Feature engineering complete** - One-hot encoding & normalization ready

## 🚀 Future Enhancements

- [ ] Add REST API endpoint (Express.js)
- [ ] Real-time WebSocket updates
- [ ] Database storage of predictions
- [ ] Model retraining pipeline
- [ ] Parallel prediction processing
- [ ] Caching predictions by route

## 📝 License

Internal Project - Sri Lanka Bus Network ETA System
