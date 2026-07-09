const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'admin-panel', 'src', 'pages', 'Admin.jsx');
let content = fs.readFileSync(adminPath, 'utf-8');

// The `loadAllData` block now handles state initialization.
// We must remove the legacy fallback blocks that overwrite our state!
// They look like:
// // Load Achievements
// const storedAchievements = null /* migrated to API */;
// if (storedAchievements) {
//   setAchievements(JSON.parse(storedAchievements));
// } else {
//   // removed initialization set call
//   setAchievements(defaultAchievements);
// }

const legacyLoadRegex = /\/\/ Load [A-Za-z\s]+[\r\n]+(?:\s*const stored[A-Za-z]+ = .*;[\r\n]+)?\s*if\s*\([^)]+\)\s*\{[\s\S]*?\}\s*else\s*\{[\s\S]*?\}\s*/g;

let matches = content.match(legacyLoadRegex);
console.log(`Found ${matches ? matches.length : 0} legacy load blocks.`);

if (matches) {
    content = content.replace(legacyLoadRegex, '');
    fs.writeFileSync(adminPath, content, 'utf-8');
    console.log("Legacy load blocks removed successfully.");
} else {
    console.log("No legacy load blocks found to remove.");
}
