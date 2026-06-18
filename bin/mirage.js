#!/usr/bin/env node

const arg = process.argv[2];
const port = process.env.MIRAGE_PORT || 8787;
const base = `http://localhost:${port}`;

async function main() {
  if (arg === 'on' || arg === 'off') {
    const enabled = arg === 'on';
    const res = await fetch(`${base}/api/mirage/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
    const data = await res.json();
    console.log(`Mirage Shield is now ${data.enabled ? 'ON' : 'OFF'}`);
  } else if (arg === 'status') {
    const res = await fetch(`${base}/api/mirage/status`);
    const data = await res.json();
    console.log(`Mirage Shield is ${data.enabled ? 'ON' : 'OFF'}`);
  } else {
    console.log('Usage: npx mirage <on|off|status>');
    process.exit(1);
  }
}

main().catch((err) => {
  if (err.cause?.code === 'ECONNREFUSED') {
    console.error(`Could not connect to server at ${base}. Is it running?`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
});
