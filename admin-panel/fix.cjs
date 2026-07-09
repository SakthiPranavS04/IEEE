const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Admin.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const newLines = [];
let insideBlock = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // We know the block starts around line 966 and ends around line 1352
  // We can just strip settingsService.set in lines 966 to 1360
  if (i >= 960 && i <= 1360) {
    if (line.includes('settingsService.set(')) {
      // skip this line
      continue;
    }
  }
  
  newLines.push(line);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Fixed Admin.jsx by removing aggressive settingsService.set calls in mount useEffect');
