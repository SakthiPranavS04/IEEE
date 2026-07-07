const fs = require('fs');
const path = require('path');

const adminPath = path.join('d:', 'IEEE', 'admin-panel', 'src', 'pages', 'Admin.jsx');
let content = fs.readFileSync(adminPath, 'utf8');

// 1. Add imports for API services
if (!content.includes('import { settingsService')) {
  content = content.replace(
    "import { API, authFetch } from '../services/api';",
    "import { API, authFetch, settingsService, galleryService, achievementsService, societiesService, teamService, committeesService } from '../services/api';"
  );
}

// 2. Make handleSaveItem async
content = content.replace('const handleSaveItem = (e) => {', 'const handleSaveItem = async (e) => {');

// 3. Make handleDeleteItem async
content = content.replace('const handleDeleteItem = (type, id) => {', 'const handleDeleteItem = async (type, id) => {');

// 4. Update handleDeleteItem
content = content.replace(
  /if \(type === 'gallery'\) \{([\s\S]*?)localStorage\.setItem\('ieee_gallery_items', JSON\.stringify\(updated\)\);/g,
  `if (type === 'gallery') {
      try {
        await galleryService.delete(id);
        const updated = galleryItems.filter(item => item.id !== id);
        setGalleryItems(updated);
      } catch (err) { console.error(err); alert("Failed to delete"); }`
);

// We will use settingsService for the rest to keep it safe and functional
const kvMap = {
  'ieee_documents': 'documents',
  'ieee_operational_committees': 'committees',
  'ieee_research_papers': 'research_papers',
  'ieee_news_items': 'news_items',
  'ieee_media_videos_v2': 'media_videos',
  'ieee_execomm_societies_v3': 'societies',
  'ieee_execomm_students_v3': 'students',
  'ieee_request_forms': 'request_forms',
  'ieee_achievements': 'achievements',
};

for (const [key, prop] of Object.entries(kvMap)) {
  // Replace localStorage.setItem
  const regex = new RegExp(`localStorage\\.setItem\\('${key}', JSON\\.stringify\\(([^)]+)\\)\\);`, 'g');
  content = content.replace(regex, `await settingsService.set('${key}', $1);`);
}

// 5. Update useEffect data loading
// For useEffect, we need a massive block replacement or targeted replace.
// Since useEffect has async data loading, we should wrap it.
content = content.replace(
  /const storedUpcoming = localStorage.getItem\('ieee_events_upcoming'\);/g,
  `
    const loadAllData = async () => {
      try {
        const fetchAndSet = async (key, setter, defaultVal) => {
          const val = await settingsService.get(key);
          if (val) setter(val);
          else { await settingsService.set(key, defaultVal); setter(defaultVal); }
        };
        
        // Example loading (you can add all here)
      } catch(e) {}
    };
    loadAllData();
    const storedUpcoming = localStorage.getItem('ieee_events_upcoming');
  `
);

fs.writeFileSync('d:\\IEEE\\admin-panel\\migrate.cjs', content);
console.log("Migration script created.");
