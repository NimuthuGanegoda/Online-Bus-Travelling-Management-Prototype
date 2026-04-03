#!/usr/bin/env python3
"""
predict_arrival.py
------------------
Loads a pre-trained XGBoost bus arrival model and its feature list,
accepts a JSON payload via stdin, and prints the predicted ETA (minutes).

Usage (standalone):
    echo '{"distance_to_stop_km": 3.2, "traffic_density": 0.6,
           "weather_score": 0.8, "passenger_count": 22,
           "driver_rating": 4.5}' | python3 predict_arrival.py

Called automatically by eta_service.js via child_process.spawn.
"""

import sys
import os
import json
import joblib
import pandas as pd

# ── 1. Read JSON from stdin ──────────────────────────────────────────────────
try:
    raw = sys.stdin.read().strip()
    input_data = json.loads(raw)
except json.JSONDecodeError as e:
    print(json.dumps({"error": f"Invalid JSON input: {e}"}))
    sys.exit(1)

# ── 2. Load model & feature list ─────────────────────────────────────────────
_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH    = os.path.join(_dir, "bus_arrival_model.joblib")
FEATURES_PATH = os.path.join(_dir, "model_features.joblib")

try:
    model    = joblib.load(MODEL_PATH)
    features = joblib.load(FEATURES_PATH)   # e.g. ['distance_to_stop_km', ...]
except FileNotFoundError as e:
    print(json.dumps({"error": f"Model file not found: {e}"}))
    sys.exit(1)

# ── 3. Validate that all required features are present ───────────────────────
missing = [f for f in features if f not in input_data]
if missing:
    print(json.dumps({"error": f"Missing required features: {missing}"}))
    sys.exit(1)

# ── 4. Build a DataFrame that matches the training feature order ──────────────
df = pd.DataFrame([input_data])[features]

# ── 5. Predict & return result ────────────────────────────────────────────────
try:
    prediction = model.predict(df)[0]
    eta_minutes = round(float(prediction), 1)
    print(json.dumps({"eta_minutes": eta_minutes}))
except Exception as e:
    print(json.dumps({"error": f"Prediction failed: {e}"}))
    sys.exit(1)
