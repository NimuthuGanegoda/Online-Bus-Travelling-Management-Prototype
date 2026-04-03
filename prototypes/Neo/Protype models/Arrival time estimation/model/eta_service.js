/**
 * eta_service.js
 * --------------
 * Simulates fetching live trip data (including driver rating from a SQL model),
 * spawns predict_arrival.py to get the XGBoost ETA, and displays the result.
 *
 * Requirements:
 *   - Node.js 14+
 *   - Python 3 with: xgboost, scikit-learn, pandas, joblib
 *       → pip install xgboost scikit-learn pandas joblib
 *   - predict_arrival.py in the same directory as this file
 *   - bus_arrival_model.joblib + model_features.joblib in the same directory
 *
 * Run:
 *   node eta_service.js
 */

"use strict";

const { spawn } = require("child_process");
const path      = require("path");

// ── 1. Simulate fetching live trip data ──────────────────────────────────────
function fetchLiveTripData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        distance_to_stop_km : 3.2,
        traffic_density      : 0.65,
        weather_score        : 0.80,
        passenger_count      : 22,
        driver_rating        : 4.5,
      });
    }, 100);
  });
}

// ── 2. Call Python predictor via stdin/stdout ────────────────────────────────
function predictETA(tripData) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "predict_arrival.py");

    // Use explicit eta_env Python to ensure clean xgboost/pandas environment
    const py = spawn("D:\\Anaconda\\envs\\eta_env\\python.exe", [scriptPath]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    py.on("error", (err) => {
      // Fires if python3 itself can't be found
      if (err.code === "ENOENT") {
        reject(new Error(
          'Could not find "python3". On Windows try renaming the command:\n' +
          '  → Open eta_service.js and change spawn("python3", ...) to spawn("python", ...)'
        ));
      } else {
        reject(err);
      }
    });

    py.on("close", (code) => {
      // Always show Python stderr when something goes wrong
      if (code !== 0) {
        const hint = buildHint(stderr);
        return reject(new Error(
          `Python exited with code ${code}.\n\n` +
          `── Python stderr ──────────────────────────────\n${stderr.trim() || "(empty)"}\n` +
          `── stdout ─────────────────────────────────────\n${stdout.trim() || "(empty)"}\n` +
          (hint ? `\n💡 Likely fix: ${hint}` : "")
        ));
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) return reject(new Error(`Prediction error: ${result.error}`));
        resolve(result.eta_minutes);
      } catch {
        reject(new Error(`Failed to parse Python output:\n"${stdout.trim()}"`));
      }
    });

    py.stdin.write(JSON.stringify(tripData));
    py.stdin.end();
  });
}

// ── 3. Suggest a fix based on the Python error message ───────────────────────
function buildHint(stderr) {
  if (stderr.includes("No module named 'xgboost'"))
    return "pip install xgboost";
  if (stderr.includes("No module named 'pandas'"))
    return "pip install pandas";
  if (stderr.includes("No module named 'joblib'"))
    return "pip install joblib";
  if (stderr.includes("No module named 'sklearn") || stderr.includes("No module named 'scikit"))
    return "pip install scikit-learn";
  if (stderr.includes("No module named"))
    return "Check the module name above and run:  pip install <module>";
  if (stderr.includes("FileNotFoundError"))
    return "Make sure bus_arrival_model.joblib and model_features.joblib are in the same folder as this script.";
  return null;
}

// ── 4. Main flow ─────────────────────────────────────────────────────────────
(async () => {
  try {
    console.log("📡 Fetching live trip data...");
    const tripData = await fetchLiveTripData();

    console.log("🔢 Trip snapshot:", tripData);
    console.log("⚙️  Running XGBoost prediction...");

    const eta = await predictETA(tripData);

    console.log(`\n🚌 Real-time ETA: ${eta} minutes\n`);
  } catch (err) {
    console.error("\n❌ ETA service error:\n");
    console.error(err.message);
    process.exit(1);
  }
})();