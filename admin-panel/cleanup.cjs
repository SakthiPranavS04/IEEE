const fs = require('fs');
const adminPath = 'd:/IEEE/admin-panel/src/pages/Admin.jsx';
let content = fs.readFileSync(adminPath, 'utf8');

content = content.replace(/localStorage\.setItem\('ieee_papers_count',\s*([^)]+)\)/g, 'await settingsService.set(\'ieee_papers_count\', $1)');
content = content.replace(/localStorage\.getItem\(`ieee_society_data_\$\{key\}_v5`\)/g, 'null');
content = content.replace(/localStorage\.setItem\('ieee_drive_folder_url',\s*([^)]+)\)/g, 'await settingsService.set(\'ieee_drive_folder_url\', $1)');
content = content.replace(/localStorage\.setItem\(`ieee_society_data_\$\{selectedBranchKey\}_v5`,\s*(JSON\.stringify\([^)]+\)|[a-zA-Z0-9_]+)\)/g, 'await settingsService.set(`ieee_society_data_${selectedBranchKey}_v5`, $1)');

fs.writeFileSync(adminPath, content);
console.log("Cleanup complete");
