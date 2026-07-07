const fs = require('fs');
const path = require('path');
const adminPath = 'd:/IEEE/admin-panel/src/pages/Admin.jsx';
let content = fs.readFileSync(adminPath, 'utf8');

if (!content.includes('import { settingsService')) {
  content = content.replace(
    /import \{ authFetch \} from '\.\.\/services\/api';/g,
    'import { API, authFetch, settingsService, galleryService, achievementsService, societiesService, teamService, committeesService } from \'../services/api\';'
  );
}

// Convert localStorage.setItem to await settingsService.set in Admin.jsx
content = content.replace(/localStorage\.setItem\('([^']+)',\s*(JSON\.stringify\([^)]+\)|[a-zA-Z0-9_]+)\)/g, 'await settingsService.set(\'$1\', $2)');

// Convert localStorage.removeItem to await settingsService.set('', null) or delete
content = content.replace(/localStorage\.removeItem\('([^']+)'\)/g, 'await settingsService.set(\'$1\', null)');

// Add async to handlers
content = content.replace('const handleSaveItem = (e) => {', 'const handleSaveItem = async (e) => {');
content = content.replace('const handleDeleteItem = (type, id) => {', 'const handleDeleteItem = async (type, id) => {');

// Fix toggleDocVisibility, toggleDocFeatured, moveDocFeatured, toggleAllConfidentialDocs to be async
content = content.replace('const toggleDocVisibility = (id) => {', 'const toggleDocVisibility = async (id) => {');
content = content.replace('const toggleDocFeatured = (id) => {', 'const toggleDocFeatured = async (id) => {');
content = content.replace('const moveDocFeatured = (id, direction) => {', 'const moveDocFeatured = async (id, direction) => {');
content = content.replace('const toggleAllConfidentialDocs = (makeConfidential) => {', 'const toggleAllConfidentialDocs = async (makeConfidential) => {');

// Fix inline doc edit saves
content = content.replace('const saveInlineDoc = (id) => {', 'const saveInlineDoc = async (id) => {');

fs.writeFileSync(adminPath, content);
console.log("Admin.jsx SET calls updated.");
