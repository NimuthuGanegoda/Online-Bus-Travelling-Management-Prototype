"""
predict_emergency.py
────────────────────
Spawned by triage_service.js via stdin/stdout IPC.

STDIN  → JSON array of emergency objects
STDOUT → JSON array of the same emergencies sorted by priority_score (desc)

Exit code 0 = success, 1 = error
"""

import sys
import json
import os
import joblib
import pandas as pd

# ── Paths (relative — Node.js sets cwd to this file's directory) ──────────────
MODEL_PATH    = "emergency_triage_model.joblib"
FEATURES_PATH = "triage_features.joblib"
ENCODERS_PATH = "encoder_maps.json"

def err(msg):
    print(json.dumps({"error": msg}), flush=True)
    sys.exit(1)

# ── Load model assets ─────────────────────────────────────────────────────────
try:
    model        = joblib.load(MODEL_PATH)
    feature_cols = joblib.load(FEATURES_PATH)
except FileNotFoundError as e:
    err(f"Model file not found: {e}. Make sure all .joblib files are in the same folder.")

try:
    with open(ENCODERS_PATH, "r") as f:
        encoder_maps = json.load(f)
except FileNotFoundError:
    err(f"encoder_maps.json not found. Download it from Colab alongside the .joblib files.")

# ── Read input ────────────────────────────────────────────────────────────────
raw = sys.stdin.read().strip()
try:
    emergencies = json.loads(raw)
except json.JSONDecodeError as e:
    err(f"Invalid JSON input: {e}")

if not isinstance(emergencies, list) or len(emergencies) == 0:
    err("Input must be a non-empty JSON array of emergency objects.")

# ── Required fields ───────────────────────────────────────────────────────────
REQUIRED_FIELDS = [
    "emergency_type", "num_victims", "victim_age_group", "location_type",
    "minutes_since_report", "caller_panic_level",
    "fire_involved", "hazmat_involved", "weapon_involved",
    "unconscious_victim", "chest_pain_reported", "breathing_difficulty",
    "severe_bleeding", "trapped_victims", "weather_severity"
]

VALID_EMERGENCY_TYPES = list(encoder_maps["emergency_type"].keys())
VALID_AGE_GROUPS      = list(encoder_maps["victim_age_group"].keys())
VALID_LOCATION_TYPES  = list(encoder_maps["location_type"].keys())

# ── Encode & predict ──────────────────────────────────────────────────────────
encoded_rows = []

for i, em in enumerate(emergencies):
    # Validate required fields
    missing = [f for f in REQUIRED_FIELDS if f not in em]
    if missing:
        err(f"Emergency #{i+1} is missing fields: {missing}")

    # Validate categorical values
    if em["emergency_type"] not in VALID_EMERGENCY_TYPES:
        err(f"Emergency #{i+1}: unknown emergency_type '{em['emergency_type']}'. "
            f"Valid types: {VALID_EMERGENCY_TYPES}")
    if em["victim_age_group"] not in VALID_AGE_GROUPS:
        err(f"Emergency #{i+1}: unknown victim_age_group '{em['victim_age_group']}'. "
            f"Valid: {VALID_AGE_GROUPS}")
    if em["location_type"] not in VALID_LOCATION_TYPES:
        err(f"Emergency #{i+1}: unknown location_type '{em['location_type']}'. "
            f"Valid: {VALID_LOCATION_TYPES}")

    # Encode categoricals using saved encoder maps
    row = {
        "emergency_type":       encoder_maps["emergency_type"][em["emergency_type"]],
        "num_victims":          em["num_victims"],
        "victim_age_group":     encoder_maps["victim_age_group"][em["victim_age_group"]],
        "location_type":        encoder_maps["location_type"][em["location_type"]],
        "minutes_since_report": em["minutes_since_report"],
        "caller_panic_level":   em["caller_panic_level"],
        "fire_involved":        em["fire_involved"],
        "hazmat_involved":      em["hazmat_involved"],
        "weapon_involved":      em["weapon_involved"],
        "unconscious_victim":   em["unconscious_victim"],
        "chest_pain_reported":  em["chest_pain_reported"],
        "breathing_difficulty": em["breathing_difficulty"],
        "severe_bleeding":      em["severe_bleeding"],
        "trapped_victims":      em["trapped_victims"],
        "weather_severity":     em["weather_severity"],
    }
    encoded_rows.append(row)

# Build DataFrame in the correct feature order
df = pd.DataFrame(encoded_rows, columns=feature_cols)

# Predict (XGBoost returns 0-indexed classes → add 1 to get 1–10)
raw_preds     = model.predict(df)
priority_scores = [int(p) + 1 for p in raw_preds]

# Attach scores and sort descending
for em, score in zip(emergencies, priority_scores):
    em["priority_score"] = score

sorted_emergencies = sorted(emergencies, key=lambda x: x["priority_score"], reverse=True)

# ── Output ────────────────────────────────────────────────────────────────────
print(json.dumps({"sorted_emergencies": sorted_emergencies}), flush=True)