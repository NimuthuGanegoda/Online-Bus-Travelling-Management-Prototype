/**
 * ETA Service - Bus Arrival Time Estimation
 * ==========================================
 * Loads trip data from CSV, runs XGBoost predictions, and outputs results.
 * 
 * Usage:
 *   node eta_service.js              (predict single trip)
 *   node eta_service.js --batch      (predict all trips from CSV)
 *   node eta_service.js --help       (show options)
 */

"use strict";

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// ── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  pythonPath: "python3",
  scriptPath: path.resolve(__dirname, "predict_arrival.py"),
  csvPath: path.resolve(__dirname, "bus_trips_dataset.csv"),
  busRatingClassifyPath: path.resolve(__dirname, "..", "Bus rating", "classify.py"),
  supabaseUrl: "https://thfphwduxzyojnnbuwey.supabase.co",
  supabaseKey: "sb_publishable_UtG5RfQWaq_3TSU8nFYe5g_ppp-LLUz",
};

const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);

// ── Utilities ────────────────────────────────────────────────────────────────

/**
 * Fetch driver rating from comments using ML classification
 */
async function getDriverRating(driverName) {
  const { data, error } = await supabase
    .from("comments")
    .select("comment")
    .eq("driver_name", driverName);

  if (error) throw new Error(`Database error: ${error.message}`);
  if (!data || data.length === 0) return 4.0;

  const comments = data.map(row => row.comment);

  return new Promise((resolve, reject) => {
    const py = spawn(CONFIG.pythonPath, [CONFIG.busRatingClassifyPath]);
    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python classification error: ${stderr}`));
      }

      try {
        const ratings = stdout
          .trim()
          .split("\n")
          .map(r => parseFloat(r));

        if (ratings.some(isNaN)) {
          return reject(new Error("Invalid rating values returned"));
        }

        const avgRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        resolve(parseFloat(avgRating));
      } catch (e) {
        reject(new Error(`Failed to parse ratings: ${e.message}`));
      }
    });

    py.on("error", (err) => {
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });

    py.stdin.write(comments.join("\n"));
    py.stdin.end();
  });
}

/**
 * Parse CSV manually (avoid external dependencies)
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",");
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const record = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx] ? values[idx].trim() : "";
    });
    records.push(record);
  }
  return records;
}

/**
 * Load trips from CSV file
 */
function loadTripsFromCSV() {
  try {
    const content = fs.readFileSync(CONFIG.csvPath, "utf-8");
    const records = parseCSV(content);
    return records.map(row => ({
      trip_id: row.trip_id,
      distance_to_stop_km: parseFloat(row.distance_to_stop_km),
      traffic_density: parseFloat(row.traffic_density),
      weather_score: parseFloat(row.weather_score),
      passenger_count: parseInt(row.passenger_count),
      is_bus_full: parseInt(row.is_bus_full),
      driver_rating: parseFloat(row.driver_rating),
      "route_id_SL-001": parseInt(row["route_id_SL-001"]),
      "route_id_SL-002": parseInt(row["route_id_SL-002"]),
      "route_id_SL-003": parseInt(row["route_id_SL-003"]),
      "route_id_SL-004": parseInt(row["route_id_SL-004"]),
      "route_id_SL-005": parseInt(row["route_id_SL-005"]),
      "route_id_SL-006": parseInt(row["route_id_SL-006"]),
      "route_id_SL-007": parseInt(row["route_id_SL-007"]),
      scenario_description: row.scenario_description,
    }));
  } catch (err) {
    console.error("❌ Error loading CSV:", err.message);
    process.exit(1);
  }
}

/**
 * Predict ETA for a single trip
 */
function predictETA(tripData) {
  return new Promise((resolve, reject) => {
    const py = spawn(CONFIG.pythonPath, [CONFIG.scriptPath]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    py.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    py.on("error", (err) => {
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });

    py.on("close", (code) => {
      if (code !== 0) {
        try {
          const result = JSON.parse(stdout.trim());
          if (result.error) return reject(new Error(result.error));
        } catch {
          return reject(new Error(`Python error: ${stderr || stdout}`));
        }
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) return reject(new Error(result.error));
        resolve(result.eta_minutes);
      } catch {
        reject(new Error(`Invalid Python output: ${stdout}`));
      }
    });

    py.stdin.write(JSON.stringify(tripData));
    py.stdin.end();
  });
}

/**
 * Multi-instance prediction with 5 different scenarios
 */
async function runMultiInstanceDemo() {
  console.log("🚌 Multi-Instance ETA Prediction Demo\n");
  console.log("=".repeat(70));
  console.log("Fetching driver ratings from database...\n");

  // Fetch driver ratings from database
  let driverArating = 4.0;
  let driverBrating = 4.0;

  try {
    driverArating = await getDriverRating("Driver_A");
    console.log(`✅ Driver_A rating: ${driverArating}/10 (from comments)\n`);
  } catch (err) {
    console.warn(`⚠️ Could not fetch Driver_A rating: ${err.message}\n`);
  }

  try {
    driverBrating = await getDriverRating("Driver_B");
    console.log(`✅ Driver_B rating: ${driverBrating}/10 (from comments)\n`);
  } catch (err) {
    console.warn(`⚠️ Could not fetch Driver_B rating: ${err.message}\n`);
  }

  // Convert 0-10 scale to 0-5 scale for ETA model
  const driverAscaled = (driverArating / 10) * 5;
  const driverBscaled = (driverBrating / 10) * 5;

  console.log("Predicting ETAs for 5 different traffic/condition scenarios\n");

  // Define 5 different instances with varying parameters
  const instances = [
    {
      name: "Instance 1: Ideal Conditions",
      description: "Short distance, light traffic, perfect weather, empty bus",
      driver: "Driver_B",
      driverRating: driverBscaled,
      data: {
        distance_to_stop_km: 2.0,
        traffic_density: 0.15,
        weather_score: 0.95,
        passenger_count: 5,
        is_bus_full: 0,
        driver_rating: driverBscaled,
        "route_id_SL-001": 1,
        "route_id_SL-002": 0,
        "route_id_SL-003": 0,
        "route_id_SL-004": 0,
        "route_id_SL-005": 0,
        "route_id_SL-006": 0,
        "route_id_SL-007": 0,
      }
    },
    {
      name: "Instance 2: Moderate Traffic",
      description: "Medium distance, moderate traffic, average weather, half-full",
      driver: "Driver_B",
      driverRating: driverBscaled,
      data: {
        distance_to_stop_km: 4.5,
        traffic_density: 0.50,
        weather_score: 0.70,
        passenger_count: 25,
        is_bus_full: 1,
        driver_rating: driverBscaled,
        "route_id_SL-001": 0,
        "route_id_SL-002": 1,
        "route_id_SL-003": 0,
        "route_id_SL-004": 0,
        "route_id_SL-005": 0,
        "route_id_SL-006": 0,
        "route_id_SL-007": 0,
      }
    },
    {
      name: "Instance 3: Heavy Traffic",
      description: "Long distance, heavy traffic, rainy, full bus, low rating driver",
      driver: "Driver_A",
      driverRating: driverAscaled,
      data: {
        distance_to_stop_km: 6.5,
        traffic_density: 0.85,
        weather_score: 0.45,
        passenger_count: 48,
        is_bus_full: 1,
        driver_rating: driverAscaled,
        "route_id_SL-001": 0,
        "route_id_SL-002": 0,
        "route_id_SL-003": 1,
        "route_id_SL-004": 0,
        "route_id_SL-005": 0,
        "route_id_SL-006": 0,
        "route_id_SL-007": 0,
      }
    },
    {
      name: "Instance 4: Peak Hour Gridlock",
      description: "Very long distance, gridlock traffic, poor weather, at capacity",
      driver: "Driver_A",
      driverRating: driverAscaled,
      data: {
        distance_to_stop_km: 8.0,
        traffic_density: 0.95,
        weather_score: 0.35,
        passenger_count: 50,
        is_bus_full: 1,
        driver_rating: driverAscaled,
        "route_id_SL-001": 0,
        "route_id_SL-002": 0,
        "route_id_SL-003": 0,
        "route_id_SL-004": 1,
        "route_id_SL-005": 0,
        "route_id_SL-006": 0,
        "route_id_SL-007": 0,
      }
    },
    {
      name: "Instance 5: Mixed Conditions",
      description: "Moderate distance, variable traffic, fair weather, 3/4 capacity",
      driver: "Driver_B",
      driverRating: driverBscaled,
      data: {
        distance_to_stop_km: 3.8,
        traffic_density: 0.60,
        weather_score: 0.65,
        passenger_count: 32,
        is_bus_full: 1,
        driver_rating: driverBscaled,
        "route_id_SL-001": 0,
        "route_id_SL-002": 0,
        "route_id_SL-003": 0,
        "route_id_SL-004": 0,
        "route_id_SL-005": 1,
        "route_id_SL-006": 0,
        "route_id_SL-007": 0,
      }
    }
  ];

  const results = [];
  
  for (let i = 0; i < instances.length; i++) {
    const instance = instances[i];
    try {
      console.log(`🔄 Processing ${instance.name}...`);
      const eta = await predictETA(instance.data);
      
      console.log(`\n ${instance.name}`);
      console.log(`   ${instance.description}`);
      console.log(`   Driver: ${instance.driver} (Rating: ${(instance.driverRating * 2).toFixed(1)}/10)`);
      console.log(`   Distance: ${instance.data.distance_to_stop_km} km`);
      console.log(`   Traffic Density: ${(instance.data.traffic_density * 100).toFixed(0)}%`);
      console.log(`   Weather Score: ${(instance.data.weather_score * 100).toFixed(0)}%`);
      console.log(`   Passenger Count: ${instance.data.passenger_count}`);
      console.log(`   Bus Full: ${instance.data.is_bus_full ? "Yes" : "No"}`);
      console.log(`   Predicted ETA: ${eta} minutes`);
      console.log();

      results.push({
        instance: instance.name,
        driver: instance.driver,
        driverRating: parseFloat((instance.driverRating * 2).toFixed(1)),
        distance: instance.data.distance_to_stop_km,
        traffic: instance.data.traffic_density,
        weather: instance.data.weather_score,
        passengers: instance.data.passenger_count,
        isBusFull: instance.data.is_bus_full,
        eta: eta
      });

    } catch (err) {
      console.error(`❌ ${instance.name}: ${err.message}\n`);
      results.push({
        instance: instance.name,
        driver: instance.driver,
        error: err.message
      });
    }
  }

  // Summary and comparison
  console.log("=".repeat(70));
  console.log("\n📊 Summary & Analysis\n");
  
  const successResults = results.filter(r => !r.error);
  if (successResults.length > 0) {
    const etas = successResults.map(r => r.eta);
    const minEta = Math.min(...etas);
    const maxEta = Math.max(...etas);
    const avgEta = (etas.reduce((a, b) => a + b, 0) / etas.length).toFixed(1);

    console.log(`Fastest ETA: ${minEta} minutes (Instance 1 - Ideal Conditions with good driver)`);
    console.log(`Slowest ETA: ${maxEta} minutes (Instance 4 - Peak Hour Gridlock with poor driver)`);
    console.log(`Average ETA: ${avgEta} minutes\n`);

    console.log("Comparison Table:\n");
    console.log("Instance | Driver   | Rating | Distance | Traffic | Weather | ETA (min)");
    console.log("-".repeat(80));
    results.forEach((r, idx) => {
      if (!r.error) {
        console.log(
          `${(idx + 1).toString().padEnd(8)} | ` +
          `${r.driver.padEnd(8)} | ` +
          `${r.driverRating.toString().padEnd(6)} | ` +
          `${r.distance.toString().padEnd(8)} | ` +
          `${(r.traffic * 100).toFixed(0).padEnd(7)}% | ` +
          `${(r.weather * 100).toFixed(0).padEnd(7)}% | ` +
          `${r.eta}`
        );
      }
    });
  }

  // Save results to JSON
  const resultFile = path.join(__dirname, "multi_instance_results.json");
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: multi_instance_results.json\n`);
}

/**
 * Format and display a single prediction result
 */
function displayResult(trip, eta) {
  console.log(`\n✅ ${trip.trip_id}`);
  console.log(`   📍 Distance: ${trip.distance_to_stop_km} km`);
  console.log(`   🚦 Traffic: ${(trip.traffic_density * 100).toFixed(0)}%`);
  console.log(`   🌤️  Weather: ${(trip.weather_score * 100).toFixed(0)}%`);
  console.log(`   👥 Passengers: ${trip.passenger_count}`);
  console.log(`   ⭐ Driver: ${trip.driver_rating}/5.0`);
  console.log(`   🎯 Scenario: ${trip.scenario_description}`);
  console.log(`   ⏱️  Predicted ETA: ${eta} minutes`);
}

/**
 * Batch process all trips from CSV
 */
async function runBatchPredictions() {
  console.log("📊 Batch Processing - Bus Arrival Time Estimation\n");
  console.log("=".repeat(60));

  const trips = loadTripsFromCSV();
  if (trips.length === 0) {
    console.error("❌ No trips found in CSV");
    process.exit(1);
  }

  console.log(`📂 Loaded ${trips.length} trips from bus_trips_dataset.csv\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const trip of trips) {
    try {
      const eta = await predictETA(trip);
      displayResult(trip, eta);
      results.push({ trip_id: trip.trip_id, eta, status: "success" });
      successCount++;
    } catch (err) {
      console.error(`\n❌ ${trip.trip_id}: ${err.message}`);
      results.push({ trip_id: trip.trip_id, status: "failed", error: err.message });
      failCount++;
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📊 Success Rate: ${((successCount / trips.length) * 100).toFixed(1)}%\n`);

  // Export results to JSON
  const resultFile = path.join(__dirname, "eta_predictions.json");
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: eta_predictions.json\n`);
}

/**
 * Single trip prediction (default)
 */
async function runSinglePrediction() {
  console.log("🚌 Bus ETA Service - Single Trip Prediction\n");

  const tripData = {
    distance_to_stop_km: 3.2,
    traffic_density: 0.65,
    weather_score: 0.80,
    passenger_count: 22,
    driver_rating: 4.5,
    is_bus_full: 1,
    "route_id_SL-001": 1,
    "route_id_SL-002": 0,
    "route_id_SL-003": 0,
    "route_id_SL-004": 0,
    "route_id_SL-005": 0,
    "route_id_SL-006": 0,
    "route_id_SL-007": 0,
  };

  try {
    console.log("Fetching trip data...");
    console.log("Trip snapshot:", tripData);
    console.log("Running XGBoost prediction...\n");

    const eta = await predictETA(tripData);
    console.log(`Real-time ETA: ${eta} minutes\n`);
  } catch (err) {
    console.error(`❌ Prediction failed: ${err.message}\n`);
    process.exit(1);
  }
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
🚌 Bus ETA Service - Usage Guide
=================================

Commands:
  node eta_service.js          Run single trip prediction
  node eta_service.js --batch  Process all trips from CSV
  node eta_service.js --demo   Run 5 multi-instance demo scenarios
  node eta_service.js --help   Show this help message

Examples:
  node eta_service.js
  $env:PYTHONPATH=''; node eta_service.js --batch
  $env:PYTHONPATH=''; node eta_service.js --demo

Files:
  - eta_service.js                Main service script
  - bus_trips_dataset.csv         Trip data for batch processing
  - predict_arrival.py            Python XGBoost predictor
  - eta_predictions.json          Results (after batch run)
  - multi_instance_results.json   Results (after demo run)
  `);
}

// ── Main Entry Point ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  showHelp();
} else if (args.includes("--batch") || args.includes("-b")) {
  runBatchPredictions().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else if (args.includes("--demo") || args.includes("-d")) {
  runMultiInstanceDemo().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
} else {
  runSinglePrediction().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
