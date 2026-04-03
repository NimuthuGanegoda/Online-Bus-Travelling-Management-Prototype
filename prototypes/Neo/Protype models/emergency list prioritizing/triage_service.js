/**
 * triage_service.js
 * ─────────────────
 * Orchestrates the emergency triage pipeline.
 *
 * Flow:
 *  1. Define a list of incoming emergencies (replace with real DB / API data)
 *  2. Spawn predict_emergency.py via stdin/stdout IPC
 *  3. Print sorted list from most critical → least critical
 *
 * Run:  node triage_service.js
 */

const { spawn } = require("child_process");
const path      = require("path");

// ── Config ────────────────────────────────────────────────────────────────────
// ⚠️  Use the full path to your bustrack conda Python (same as eta_service.js)
const PYTHON_PATH = "C:\\Users\\Nimuthu Ganegoda\\AppData\\Local\\Microsoft\\WindowsApps\\PythonSoftwareFoundation.Python.3.11_qbz5n2kfra8p0\\python.exe";
const SCRIPT_PATH = path.join(__dirname, "predict_emergency.py");

// ── Sample emergencies to triage ──────────────────────────────────────────────
// In production, replace this array with data from your database or API.
// All fields are required — see predict_emergency.py for valid enum values.
const incomingEmergencies = [
  {
    id: "INC-001",
    description: "Elderly man collapsed, not breathing",
    emergency_type: "cardiac_arrest",
    num_victims: 1,
    victim_age_group: "elderly",
    location_type: "residential",
    minutes_since_report: 2,
    caller_panic_level: 9,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 1,
    chest_pain_reported: 1,
    breathing_difficulty: 1,
    severe_bleeding: 0,
    trapped_victims: 0,
    weather_severity: 0,
  },
  {
    id: "INC-002",
    description: "Loud music from apartment, neighbours complaining",
    emergency_type: "noise_complaint",
    num_victims: 0,
    victim_age_group: "adult",
    location_type: "residential",
    minutes_since_report: 45,
    caller_panic_level: 2,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 0,
    chest_pain_reported: 0,
    breathing_difficulty: 0,
    severe_bleeding: 0,
    trapped_victims: 0,
    weather_severity: 0,
  },
  {
    id: "INC-003",
    description: "Chemical tank ruptured at factory, workers exposed",
    emergency_type: "chemical_spill",
    num_victims: 6,
    victim_age_group: "adult",
    location_type: "industrial",
    minutes_since_report: 4,
    caller_panic_level: 8,
    fire_involved: 1,
    hazmat_involved: 1,
    weapon_involved: 0,
    unconscious_victim: 0,
    chest_pain_reported: 0,
    breathing_difficulty: 1,
    severe_bleeding: 0,
    trapped_victims: 1,
    weather_severity: 1,
  },
  {
    id: "INC-004",
    description: "Teen fell off bike, scraped knee",
    emergency_type: "minor_injury",
    num_victims: 1,
    victim_age_group: "teen",
    location_type: "outdoor",
    minutes_since_report: 10,
    caller_panic_level: 3,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 0,
    chest_pain_reported: 0,
    breathing_difficulty: 0,
    severe_bleeding: 0,
    trapped_victims: 0,
    weather_severity: 0,
  },
  {
    id: "INC-005",
    description: "Active shooter in shopping mall, multiple injured",
    emergency_type: "active_shooter",
    num_victims: 4,
    victim_age_group: "child",
    location_type: "commercial",
    minutes_since_report: 1,
    caller_panic_level: 10,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 1,
    unconscious_victim: 1,
    chest_pain_reported: 0,
    breathing_difficulty: 0,
    severe_bleeding: 1,
    trapped_victims: 1,
    weather_severity: 0,
  },
  {
    id: "INC-006",
    description: "House fire, family of 4 trapped on second floor",
    emergency_type: "active_fire_with_trapped",
    num_victims: 4,
    victim_age_group: "child",
    location_type: "residential",
    minutes_since_report: 3,
    caller_panic_level: 10,
    fire_involved: 1,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 0,
    chest_pain_reported: 0,
    breathing_difficulty: 1,
    severe_bleeding: 0,
    trapped_victims: 1,
    weather_severity: 0,
  },
  {
    id: "INC-007",
    description: "Car windshield smashed in parking lot",
    emergency_type: "vandalism",
    num_victims: 0,
    victim_age_group: "adult",
    location_type: "commercial",
    minutes_since_report: 60,
    caller_panic_level: 2,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 0,
    chest_pain_reported: 0,
    breathing_difficulty: 0,
    severe_bleeding: 0,
    trapped_victims: 0,
    weather_severity: 0,
  },
  {
    id: "INC-008",
    description: "Drowning at public pool, child unresponsive",
    emergency_type: "drowning",
    num_victims: 1,
    victim_age_group: "child",
    location_type: "commercial",
    minutes_since_report: 1,
    caller_panic_level: 10,
    fire_involved: 0,
    hazmat_involved: 0,
    weapon_involved: 0,
    unconscious_victim: 1,
    chest_pain_reported: 0,
    breathing_difficulty: 1,
    severe_bleeding: 0,
    trapped_victims: 0,
    weather_severity: 0,
  },
];

// ── Hint builder (same pattern as eta_service.js) ─────────────────────────────
function buildHint(stderr) {
  const hints = {
    "No module named 'xgboost'":
      "→ Run: D:\\Anaconda\\envs\\bustrack\\python.exe -m pip install xgboost",
    "No module named 'joblib'":
      "→ Run: D:\\Anaconda\\envs\\bustrack\\python.exe -m pip install joblib",
    "No module named 'pandas'":
      "→ Run: D:\\Anaconda\\envs\\bustrack\\python.exe -m pip install pandas",
    "No module named 'sklearn'":
      "→ Run: D:\\Anaconda\\envs\\bustrack\\python.exe -m pip install scikit-learn",
  };
  for (const [key, hint] of Object.entries(hints)) {
    if (stderr.includes(key)) return hint;
  }
  return "";
}

// ── Core triage function ──────────────────────────────────────────────────────
function triageEmergencies(emergencies) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚨 Triaging ${emergencies.length} incoming emergencies...\n`);

    // Strip the `id` and `description` fields before sending to Python
    // (the model only needs the feature fields)
    const payload = emergencies.map(({ id, description, ...features }) => features);

    const py = spawn(PYTHON_PATH, [SCRIPT_PATH], { cwd: __dirname });

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => (stdout += data.toString()));
    py.stderr.on("data", (data) => (stderr += data.toString()));

    py.on("error", (err) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(
            `Python not found at:\n  ${PYTHON_PATH}\n` +
              `Check the path is correct and the bustrack conda env exists.`
          )
        );
      } else {
        reject(err);
      }
    });

    py.on("close", (code) => {
      if (code !== 0) {
        const hint = buildHint(stderr);
        reject(
          new Error(
            `Python exited with code ${code}\n\nSTDERR:\n${stderr}` +
              (hint ? `\n\n💡 Fix: ${hint}` : "")
          )
        );
        return;
      }

      try {
        const result = JSON.parse(stdout);

        if (result.error) {
          reject(new Error(`Python error: ${result.error}`));
          return;
        }

        // Re-attach id + description from the original list
        const enriched = result.sorted_emergencies.map((sorted) => {
          // Match back by emergency_type + num_victims (unique enough for a demo)
          const original = emergencies.find(
            (e) =>
              e.emergency_type === sorted.emergency_type &&
              e.num_victims    === sorted.num_victims
          );
          return {
            id:             original?.id          ?? "???",
            description:    original?.description ?? "???",
            priority_score: sorted.priority_score,
            emergency_type: sorted.emergency_type,
          };
        });

        resolve(enriched);
      } catch (e) {
        reject(new Error(`Failed to parse Python output:\n${stdout}`));
      }
    });

    // Send emergencies to Python via stdin
    py.stdin.write(JSON.stringify(payload));
    py.stdin.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const sorted = await triageEmergencies(incomingEmergencies);

    console.log("═══════════════════════════════════════════════════════════");
    console.log("   🚨  EMERGENCY TRIAGE REPORT — Sorted by Priority        ");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`${"Rank".padEnd(6)}${"ID".padEnd(10)}${"Score".padEnd(8)}${"Type".padEnd(30)}Description`);
    console.log("───────────────────────────────────────────────────────────");

    sorted.forEach((em, i) => {
      const rank  = `${i + 1}.`.padEnd(6);
      const id    = em.id.padEnd(10);
      const score = `[${em.priority_score}/10]`.padEnd(8);
      const type  = em.emergency_type.padEnd(30);
      console.log(`${rank}${id}${score}${type}${em.description}`);
    });

    console.log("═══════════════════════════════════════════════════════════");
    console.log(`✅ Triage complete. Dispatch units to INC-${sorted[0].id.split("-")[1]} first.`);
  } catch (err) {
    console.error("\n❌ Triage service error:\n", err.message);
    process.exit(1);
  }
})();
