/**
 * StadiumPulse AI - IoT Sensor & Turnstile Influx Simulator
 * Simulates real-time turnstile entry data and weather conditions for MetLife Stadium.
 * Periodically simulates crowd density spikes at Gate C3 to trigger the "Stadium Brain" redirect.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const INTERVAL_MS = 3000; // Update every 3 seconds
const OUTPUT_FILE = path.join(__dirname, 'live-sensor-data.json');

const GATES = ['Gate A1', 'Gate A2', 'Gate B1', 'Gate B2', 'Gate C1', 'Gate C3'];

// Initial state
let tick = 0;
let baseAttendance = 68000;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSensorData() {
  tick++;
  
  // Slowly increment total attendance
  if (baseAttendance < 78000) {
    baseAttendance += getRandomInt(10, 80);
  }

  // Generate gate entries per minute
  const gateData = GATES.map(gateName => {
    let entryRate = getRandomInt(45, 120); // Normal calm entries per min
    let status = 'calm';

    // Simulate crowd congestion spike at Gate C3 every 10 ticks
    if (gateName === 'Gate C3' && tick % 10 >= 7) {
      entryRate = getRandomInt(280, 390); // Spike
      status = 'critical';
    } else if (gateName === 'Gate B2' && tick % 8 >= 5) {
      entryRate = getRandomInt(150, 220); // Elevated
      status = 'caution';
    }

    return {
      gate: gateName,
      entriesPerMinute: entryRate,
      densityStatus: status,
      cumulativeEntries: getRandomInt(5000, 15000) + (tick * entryRate)
    };
  });

  const sensorPayload = {
    timestamp: new Date().toISOString(),
    totalAttendance: baseAttendance,
    stadiumTemperatureFahrenheit: 82 + getRandomInt(-1, 1),
    gates: gateData,
    sustainabilityMetric: {
      energyEfficiencyPercentage: 94.2,
      wasteDiversionRate: 74.8,
      ecoTransportPercentage: 82.0
    }
  };

  return sensorPayload;
}

function runSimulator() {
  console.log('⚡ StadiumPulse AI: Starting IoT Turnstile & Sensor Simulator...');
  console.log(`Writing real-time outputs to: ${OUTPUT_FILE}`);
  console.log('Press Ctrl+C to stop.');

  // Run immediately and then on interval
  const update = () => {
    try {
      const data = generateSensorData();
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
      
      const c3 = data.gates.find(g => g.gate === 'Gate C3');
      console.log(`[${data.timestamp}] Total Fans: ${data.totalAttendance} | Gate C3 Influx: ${c3.entriesPerMinute}/min (${c3.densityStatus.toUpperCase()})`);
    } catch (error) {
      console.error('Error generating simulator data:', error.message);
    }
  };

  update();
  return setInterval(update, INTERVAL_MS);
}

// Check if run directly
if (require.main === module) {
  runSimulator();
}

module.exports = { generateSensorData, runSimulator };
