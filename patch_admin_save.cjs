const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'admin-panel', 'src', 'pages', 'Admin.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: achievements.length > 0 ? Math.max(...achievements.map(i => i.id)) + 1 : 1,
          title: achTitle,
          category: achCategory,
          desc: achDesc,
          iconType: achIconType
        };
        updated = [...achievements, newItem];
      } else {
        updated = achievements.map(item =>
          item.id === currentItemId
            ? { ...item, title: achTitle, category: achCategory, desc: achDesc, iconType: achIconType }
            : item
        );
      }
      setAchievements(updated);
      settingsService.set('ieee_achievements', JSON.stringify(updated));`,
    replace: `        const payload = { title: achTitle, category: achCategory, desc: achDesc, iconType: achIconType };
        try {
          if (modalMode === 'add') {
            payload.id = achievements.length > 0 ? Math.max(...achievements.map(i => i.id)) + 1 : 1;
            const saved = await achievementsService.create(payload);
            setAchievements([...achievements, saved]);
          } else {
            const saved = await achievementsService.update(currentItemId, payload);
            setAchievements(achievements.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  },
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: societies.length > 0 ? Math.max(...societies.map(i => i.id)) + 1 : 1,
          name: societyName,
          faculty1: { name: fac1Name, position: fac1Position, phone: fac1Phone, image: fac1Image },
          faculty2: { name: fac2Name, position: fac2Position, phone: fac2Phone, image: fac2Image }
        };
        updated = [...societies, newItem];
      } else {
        updated = societies.map(item =>
          item.id === currentItemId
            ? {
                ...item,
                name: societyName,
                faculty1: { name: fac1Name, position: fac1Position, phone: fac1Phone, image: fac1Image },
                faculty2: { name: fac2Name, position: fac2Position, phone: fac2Phone, image: fac2Image }
              }
            : item
        );
      }
      setSocieties(updated);
      settingsService.set('ieee_execomm_societies_v3', JSON.stringify(updated));`,
    replace: `        const payload = {
          name: societyName,
          faculty1: { name: fac1Name, position: fac1Position, phone: fac1Phone, image: fac1Image },
          faculty2: { name: fac2Name, position: fac2Position, phone: fac2Phone, image: fac2Image }
        };
        try {
          if (modalMode === 'add') {
            payload.id = societies.length > 0 ? Math.max(...societies.map(i => i.id)) + 1 : 1;
            const saved = await societiesService.create(payload);
            setSocieties([...societies, saved]);
          } else {
            const saved = await societiesService.update(currentItemId, payload);
            setSocieties(societies.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  },
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: students.length > 0 ? Math.max(...students.map(i => i.id)) + 1 : 1,
          name: studentName,
          department: studentDept,
          yearOfStudy: studentYear,
          ieeeNumber: studentIeeeNumber,
          position: studentPosition,
          society: studentSociety,
          image: studentImage,
          email: studentEmail,
          phone: studentPhone,
          linkedin: studentLinkedin
        };
        updated = [...students, newItem];
      } else {
        updated = students.map(item =>
          item.id === currentItemId
            ? {
                ...item,
                name: studentName,
                department: studentDept,
                yearOfStudy: studentYear,
                ieeeNumber: studentIeeeNumber,
                position: studentPosition,
                society: studentSociety,
                image: studentImage,
                email: studentEmail,
                phone: studentPhone,
                linkedin: studentLinkedin
              }
            : item
        );
      }
      setStudents(updated);
      settingsService.set('ieee_execomm_students_v3', JSON.stringify(updated));`,
    replace: `        const payload = {
          name: studentName, department: studentDept, yearOfStudy: studentYear,
          ieeeNumber: studentIeeeNumber, position: studentPosition, society: studentSociety,
          image: studentImage, email: studentEmail, phone: studentPhone, linkedin: studentLinkedin
        };
        try {
          if (modalMode === 'add') {
            payload.id = students.length > 0 ? Math.max(...students.map(i => i.id)) + 1 : 1;
            const saved = await teamService.create(payload);
            setStudents([...students, saved]);
          } else {
            const saved = await teamService.update(currentItemId, payload);
            setStudents(students.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  },
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: committees.length > 0 ? Math.max(...committees.map(i => i.id)) + 1 : 1,
          name: commName,
          desc: commDesc,
          lead: commLead,
          coLead: commCoLead,
          teamCount: parseInt(commTeamCount) || 10
        };
        updated = [...committees, newItem];
      } else {
        updated = committees.map(item =>
          item.id === currentItemId
            ? { ...item, name: commName, desc: commDesc, lead: commLead, coLead: commCoLead, teamCount: parseInt(commTeamCount) || 10 }
            : item
        );
      }
      setCommittees(updated);
      settingsService.set('ieee_operational_committees', JSON.stringify(updated));`,
    replace: `        const payload = {
          name: commName, desc: commDesc, lead: commLead, coLead: commCoLead, teamCount: parseInt(commTeamCount) || 10
        };
        try {
          if (modalMode === 'add') {
            payload.id = committees.length > 0 ? Math.max(...committees.map(i => i.id)) + 1 : 1;
            const saved = await committeesService.create(payload);
            setCommittees([...committees, saved]);
          } else {
            const saved = await committeesService.update(currentItemId, payload);
            setCommittees(committees.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  },
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: researchPapers.length > 0 ? Math.max(...researchPapers.map(i => i.id)) + 1 : 1,
          title: paperTitle,
          authors: paperAuthors,
          category: paperCategory,
          desc: paperDesc,
          year: paperYear,
          fileUrl: paperFile || \`paper_\${Date.now()}.pdf\`
        };
        updated = [...researchPapers, newItem];
        
        // Increment papers count when a new paper is added
        const currentCount = parseInt(papersCount) || 0;
        const newCount = currentCount + 1;
        setPapersCount(newCount.toString());
        settingsService.set('ieee_papers_count', newCount.toString());
      } else {
        updated = researchPapers.map(item =>
          item.id === currentItemId
            ? { ...item, title: paperTitle, authors: paperAuthors, category: paperCategory, desc: paperDesc, year: paperYear, fileUrl: paperFile || item.fileUrl }
            : item
        );
      }
      setResearchPapers(updated);
      settingsService.set('ieee_research_papers', JSON.stringify(updated));`,
    replace: `        const payload = {
          title: paperTitle, authors: paperAuthors, category: paperCategory, desc: paperDesc, year: paperYear, fileUrl: paperFile || \`paper_\${Date.now()}.pdf\`
        };
        try {
          if (modalMode === 'add') {
            payload.id = researchPapers.length > 0 ? Math.max(...researchPapers.map(i => i.id)) + 1 : 1;
            const saved = await researchService.create(payload);
            setResearchPapers([...researchPapers, saved]);
            const newCount = (parseInt(papersCount) || 0) + 1;
            setPapersCount(newCount.toString());
            settingsService.set('ieee_papers_count', newCount.toString());
          } else {
            const saved = await researchService.update(currentItemId, payload);
            setResearchPapers(researchPapers.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  },
  {
    find: `        let updated = [];
      if (modalMode === 'add') {
        const newItem = {
          id: newsItems.length > 0 ? Math.max(...newsItems.map(i => i.id)) + 1 : 1,
          title: newsTitle,
          source: newsSource,
          date: newsDate,
          snippet: newsSnippet,
          color: newsColor,
          image: newsCoverType === 'image' ? newsImage : null
        };
        updated = [...newsItems, newItem];
      } else {
        updated = newsItems.map(item =>
          item.id === currentItemId
            ? { ...item, title: newsTitle, source: newsSource, date: newsDate, snippet: newsSnippet, color: newsColor, image: newsCoverType === 'image' ? newsImage : null }
            : item
        );
      }
      setNewsItems(updated);
      settingsService.set('ieee_news_items', JSON.stringify(updated));`,
    replace: `        const payload = {
          title: newsTitle, source: newsSource, date: newsDate, snippet: newsSnippet, color: newsColor, image: newsCoverType === 'image' ? newsImage : null
        };
        try {
          if (modalMode === 'add') {
            payload.id = newsItems.length > 0 ? Math.max(...newsItems.map(i => i.id)) + 1 : 1;
            const saved = await newsService.create(payload);
            setNewsItems([...newsItems, saved]);
          } else {
            const saved = await newsService.update(currentItemId, payload);
            setNewsItems(newsItems.map(item => item.id === currentItemId ? saved : item));
          }
        } catch (e) { console.error(e); }`
  }
];

let modified = 0;
for (const rep of replacements) {
  if (content.includes(rep.find)) {
    content = content.replace(rep.find, rep.replace);
    modified++;
  } else {
    // If exact match fails, fallback to regex spacing ignoring
    const regexFind = new RegExp(rep.find.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&').replace(/\\s+/g, '\\\\s+'), 'g');
    if (regexFind.test(content)) {
      content = content.replace(regexFind, rep.replace);
      modified++;
    } else {
      console.log('Failed to find snippet:', rep.find.substring(0, 50) + '...');
    }
  }
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully applied ' + modified + ' replacements to Admin.jsx handleSaveItem!');
