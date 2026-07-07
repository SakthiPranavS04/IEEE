const fs = require('fs');
const path = require('path');
const adminPath = 'd:/IEEE/admin-panel/src/pages/Admin.jsx';
let content = fs.readFileSync(adminPath, 'utf8');

// We replace the state initializations:
// from `useState(() => JSON.parse(localStorage.getItem('ieee_gallery_items') || '[]'))`
// to `useState([])`
content = content.replace(/useState\(\(\)\s*=>\s*JSON\.parse\(localStorage\.getItem\('[^']+'\)\s*\|\|\s*'\[\]'\)\)/g, 'useState([])');
content = content.replace(/useState\(\(\)\s*=>\s*localStorage\.getItem\('[^']+'\)\s*\|\|\s*'[^']*'\)/g, 'useState("")');
content = content.replace(/useState\(\(\)\s*=>\s*localStorage\.getItem\('[^']+'\)\s*\|\|\s*\[\]\)/g, 'useState([])');
content = content.replace(/useState\(JSON\.parse\(localStorage\.getItem\('[^']+'\)\s*\|\|\s*'\[\]'\)\)/g, 'useState([])');

// We inject a fetch function in useEffect
// There's a known anchor: `if (isLoggedIn) fetchEvents();`
// We will replace it with a massive loader.
const fetchAnchor = 'if (isLoggedIn) fetchEvents();';
const newLoader = `if (isLoggedIn) {
      fetchEvents();
      
      const fetchSettingsData = async () => {
        try {
          const keysAndSetters = [
            { key: 'ieee_gallery_items', setter: setGalleryItems, def: [] },
            { key: 'ieee_achievements', setter: setAchievements, def: [] },
            { key: 'ieee_operational_committees', setter: setCommittees, def: [] },
            { key: 'ieee_research_papers', setter: setResearchPapers, def: [] },
            { key: 'ieee_news_items', setter: setNewsItems, def: [] },
            { key: 'ieee_media_videos_v2', setter: setMediaVideos, def: [] },
            { key: 'ieee_execomm_societies_v3', setter: setSocieties, def: [] },
            { key: 'ieee_execomm_students_v3', setter: setStudents, def: [] },
            { key: 'ieee_request_forms', setter: setRequestForms, def: [] },
            { key: 'ieee_documents', setter: setDocuments, def: [] }
          ];
          
          const settings = await settingsService.getAll();
          // settings is an array of { key, value }
          const settingsMap = {};
          if (Array.isArray(settings)) {
            settings.forEach(s => settingsMap[s.key] = s.value);
          }
          
          keysAndSetters.forEach(({ key, setter, def }) => {
            if (settingsMap[key]) {
              setter(settingsMap[key]);
            } else {
              setter(def);
            }
          });
        } catch (e) { console.error("Error loading settings data:", e); }
      };
      
      fetchSettingsData();
    }`;

content = content.replace(fetchAnchor, newLoader);

// Finally, remove the synchronous `localStorage.getItem` reads inside useEffect.
// They usually look like: const storedXYZ = localStorage.getItem('...'); if (storedXYZ) { setXYZ(JSON.parse(storedXYZ)) }
// Since they are now safely loaded by `fetchSettingsData`, we can just leave the variables or comment them out.
// For now, replacing the most common ones with empty arrays to prevent parsing errors.
content = content.replace(/localStorage\.getItem\('([^']+)'\)/g, 'null /* migrated to API */');

fs.writeFileSync(adminPath, content);
console.log("Admin.jsx GET calls migrated.");
