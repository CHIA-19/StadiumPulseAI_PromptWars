const assert = require('assert');
const { generateSensorData } = require('./index');

console.log('🧪 Running IoT Sensor Simulator assertions...');

const data = generateSensorData();

// Verify payload structure
assert.ok(data.timestamp, 'Payload should contain a timestamp');
assert.ok(data.totalAttendance >= 68000, 'Attendance should be greater than or equal to initial base');
assert.ok(data.stadiumTemperatureFahrenheit >= 80, 'Temperature should be in range');

// Verify gate counts
assert.strictEqual(data.gates.length, 6, 'Should simulate exactly 6 gates');

data.gates.forEach(g => {
  assert.ok(g.gate, 'Gate object must contain a name');
  assert.ok(g.entriesPerMinute >= 0, 'Entries per minute must be non-negative');
  assert.ok(['calm', 'caution', 'critical'].includes(g.densityStatus), 'Status should be calm, caution or critical');
});

console.log('✅ IoT Sensor Simulator assertions passed successfully!');
