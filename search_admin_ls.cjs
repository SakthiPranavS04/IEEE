const fs = require('fs');
const lines = fs.readFileSync('d:/IEEE/admin-panel/src/pages/Admin.jsx', 'utf-8').split('\n');
lines.forEach((line, i) => {
  if (line.includes('localStorage.setItem') || line.includes('localStorage.getItem')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
