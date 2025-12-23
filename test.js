
// Logic from main.js
function createDateInZone(dateStr, timeStr, zone) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  
  let date = new Date(Date.UTC(y, m - 1, d, h, min));
  
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric',
      hour12: false
    }).formatToParts(date);
    
    const part = (type) => parseInt(parts.find(p => p.type === type).value);
    
    const currentZoneTimeMs = Date.UTC(part('year'), part('month') - 1, part('day'), part('hour'), part('minute'));
    const targetTimeMs = Date.UTC(y, m - 1, d, h, min);
    
    const diff = targetTimeMs - currentZoneTimeMs;
    
    if (diff === 0) break;
    
    date = new Date(date.getTime() + diff);
  }
  
  return date;
}

// Test cases
const tests = [
  // Kyiv is UTC+2 in Winter, UTC+3 in Summer
  { date: '2024-01-01', time: '10:00', zone: 'Europe/Kyiv', expectedUTCHour: 8 }, // Winter
  { date: '2024-06-01', time: '10:00', zone: 'Europe/Kyiv', expectedUTCHour: 7 }, // Summer
  
  // New York is UTC-5 in Winter, UTC-4 in Summer
  { date: '2024-01-01', time: '10:00', zone: 'America/New_York', expectedUTCHour: 15 }, // Winter
  { date: '2024-06-01', time: '10:00', zone: 'America/New_York', expectedUTCHour: 14 }, // Summer
];

let failed = false;
console.log('Running Timezone Logic Tests...\n');

tests.forEach(t => {
  const res = createDateInZone(t.date, t.time, t.zone);
  const utcHour = res.getUTCHours();
  
  // Check if matches expectation
  if (utcHour === t.expectedUTCHour) {
    console.log(`✅ ${t.zone} ${t.date} ${t.time} -> UTC Hour ${utcHour} (Correct)`);
  } else {
    console.log(`❌ ${t.zone} ${t.date} ${t.time} -> Expected UTC ${t.expectedUTCHour}, Got ${utcHour}`);
    console.log(`   Full Date: ${res.toISOString()}`);
    failed = true;
  }
});

if (failed) process.exit(1);
console.log('\nAll tests passed.');
