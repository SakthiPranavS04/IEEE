const fs = require('fs');
const path = require('path');
const pagesDir = 'd:/IEEE/admin-panel/src/pages';

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx') && f !== 'Admin.jsx');

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  let modified = false;

  // Add settingsService import if localStorage is used
  if (content.includes('localStorage.getItem') || content.includes('localStorage.setItem')) {
    if (!content.includes('settingsService')) {
      // Find the last import
      const imports = content.match(/import .*?;/g);
      if (imports && imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        content = content.replace(lastImport, lastImport + "\nimport { settingsService } from '../services/api';");
        modified = true;
      }
    }
  }

  // Replace localStorage.getItem
  if (content.includes('localStorage.getItem')) {
    // We can't do direct string replacement because useEffect is synchronous. 
    // This is tricky. But for Home.jsx, it reads them directly in render sometimes.
    // React render cannot be async. We need to find `useState(() => localStorage...)` and fix them.
    content = content.replace(/useState\(\(\)\s*=>\s*localStorage\.getItem\('[^']+'\)\s*\|\|\s*'[^']*'\)/g, 'useState("")');
    
    // We will leave the rest for manual or specific replacements, as public pages are many and varied.
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }
});
console.log("Public pages checked.");
