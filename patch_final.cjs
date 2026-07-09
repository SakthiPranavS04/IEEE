const fs = require('fs');
const path = require('path');

// 1. Add societiesService to api.js
const apiPath = 'd:\\IEEE\\public-website\\src\\services\\api.js';
let apiContent = fs.readFileSync(apiPath, 'utf8');
if (!apiContent.includes('societiesService')) {
  const newService = `export const societiesService = {
  getAll: () => fetchWrapper(\`\${API}/societies\`),
};

`;
  apiContent = apiContent.replace('export const settingsService = {', newService + 'export const settingsService = {');
}
if (!apiContent.includes('committeesService')) {
  const commService = `export const committeesService = {
  getAll: () => fetchWrapper(\`\${API}/committees\`),
};

`;
  apiContent = apiContent.replace('export const settingsService = {', commService + 'export const settingsService = {');
}
fs.writeFileSync(apiPath, apiContent);

// 2. Patch Society Pages
const societyPages = [
  { file: 'RASPage.jsx', key: 'ras' },
  { file: 'PESPage.jsx', key: 'pes' },
  { file: 'ComSocPage.jsx', key: 'comsoc' },
  { file: 'ComputerSocietyPage.jsx', key: 'computer-society' },
  { file: 'APSPage.jsx', key: 'ap-s' },
  { file: 'WIEPage.jsx', key: 'wie' }
];

const societyDir = 'd:\\IEEE\\public-website\\src\\pages';
societyPages.forEach(page => {
  const pPath = path.join(societyDir, page.file);
  let content = fs.readFileSync(pPath, 'utf8');
  
  if (!content.includes('import API')) {
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport API from '../services/api';");
  }

  const oldEffect = `  useEffect(() => {
    const stored = localStorage.getItem('ieee_society_data_${page.key}_v5');
    if (stored) {
      try {
        setSocietyData(JSON.parse(stored));
      } catch (e) {
        setSocietyData(defaultData);
      }
    } else {
      setSocietyData(defaultData);
    }
  }, []);`;

  const newEffect = `  useEffect(() => {
    const loadData = async () => {
      try {
        const societies = await API.societiesService.getAll();
        const found = societies.find(s => s.key === '${page.key}' || s.name.toLowerCase().includes('${page.key.split('-')[0]}'));
        if (found) setSocietyData(found);
        else setSocietyData(defaultData);
      } catch (e) {
        setSocietyData(defaultData);
      }
    };
    loadData();
  }, []);`;

  content = content.replace(oldEffect, newEffect);
  fs.writeFileSync(pPath, content);
});

// 3. Patch Committees.jsx
const commPath = path.join(societyDir, 'Committees.jsx');
let commContent = fs.readFileSync(commPath, 'utf8');
if (!commContent.includes('import API')) {
  commContent = commContent.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport API from '../services/api';");
}

const oldCommEffect = `    const storedCommittees = localStorage.getItem('ieee_operational_committees');
    if (storedCommittees) {
      setOpCommittees(JSON.parse(storedCommittees));
    } else {
      localStorage.setItem('ieee_operational_committees', JSON.stringify(defaultCommittees));
      setOpCommittees(defaultCommittees);
    }

    const storedPhilosophy = localStorage.getItem('ieee_committees_philosophy_v1');
    if (storedPhilosophy) {
      setPhilosophy(JSON.parse(storedPhilosophy));
    } else {
      localStorage.setItem('ieee_committees_philosophy_v1', JSON.stringify(defaultPhilosophy));
    }

    const storedCta = localStorage.getItem('ieee_committees_cta_v1');
    if (storedCta) {
      setCta(JSON.parse(storedCta));
    } else {
      localStorage.setItem('ieee_committees_cta_v1', JSON.stringify(defaultCta));
    }`;

const newCommEffect = `    const loadData = async () => {
      try {
        const [commData, settingsData] = await Promise.all([
          API.committeesService.getAll(),
          API.settingsService.getAll()
        ]);
        
        if (commData && commData.length > 0) setOpCommittees(commData);
        else setOpCommittees(defaultCommittees);
        
        const getVal = (key) => {
          const s = settingsData.find(s => s.key === key);
          return s ? s.value : null;
        };
        
        const p = getVal('ieee_committees_philosophy_v1');
        if (p) {
          try { setPhilosophy(typeof p === 'string' ? JSON.parse(p) : p); } catch(e){}
        }
        
        const c = getVal('ieee_committees_cta_v1');
        if (c) {
          try { setCta(typeof c === 'string' ? JSON.parse(c) : c); } catch(e){}
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadData();`;

commContent = commContent.replace(oldCommEffect, newCommEffect);
fs.writeFileSync(commPath, commContent);

console.log('Successfully patched all remaining pages.');
