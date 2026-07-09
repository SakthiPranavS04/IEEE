const fs = require('fs');
const file = 'd:\\IEEE\\public-website\\src\\pages\\Media.jsx';
const lines = fs.readFileSync(file, 'utf8').split('\n');

// We want to delete lines 122 to 174 (0-indexed 121 to 173).
// Actually, let's just find `      text: "24/7 library access",` and delete everything up to `  ];` right before `  // Default news items`
const startIdx = lines.findIndex(l => l.includes('text: "24/7 library access"'));
const endIdx = lines.findIndex(l => l.includes('// Default news items'));

if (startIdx !== -1 && endIdx !== -1) {
    // Delete lines from startIdx - 1 (the empty space) to endIdx - 1
    lines.splice(startIdx - 1, endIdx - startIdx + 1);
    fs.writeFileSync(file, lines.join('\n'));
    console.log('Fixed syntax error in Media.jsx');
} else {
    console.log('Could not find markers');
}
