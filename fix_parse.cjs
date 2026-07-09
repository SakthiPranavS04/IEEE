const fs = require('fs');
let content = fs.readFileSync('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx', 'utf8');

// I need to locate where `image: "/assets/student_female.png"` was injected right after `url: "https://youtu.be/8qGIyNu5Qqo",`
// Wait, looking at the previous diff, it was:
/*
        {
          title: "IEEE KEC SB Decade Celebration Promo",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
id: 18,
      name: "Sandhya R.",
...
*/

// Let's use regex to find `url: "https://www.youtube.com/embed/dQw4w9WgXcQ",` and slice everything from there until `const defaultCommittees = [` or `const defaultMission = ` and reconstruct the file cleanly.

const backup = content;

// This is where it went wrong:
const startFix = content.indexOf('          title: "IEEE KEC SB Decade Celebration Promo",\r\n          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",');
if (startFix === -1) {
    const startFix2 = content.indexOf('          title: "IEEE KEC SB Decade Celebration Promo",\n          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",');
}

// Actually, let's just use string replacement for the damaged parts.
// Let's just find `defaultMediaVideos` definition entirely and the start of `useEffect`
const videosStart = content.indexOf('const defaultMediaVideos = [');
const fetchEventsStart = content.indexOf('    const fetchEvents = async () => {');

if (videosStart !== -1 && fetchEventsStart !== -1) {
    // Replace the entire chunk between videosStart and fetchEventsStart
    const newChunk = `const defaultMediaVideos = [
        {
          title: "IEEE KEC SB Decade Celebration Promo",
          url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          desc: "An overview reel capturing 10 years of student leadership, technical symposiums, and outreach drives."
        },
        {
          title: "GreenTech Hackathon Pitch Finalists",
          url: "https://youtu.be/8qGIyNu5Qqo",
          desc: "Recap video showcasing student project prototypes and presentation pitches at Perundurai."
        }
      ];
      // removed initialization set call
      setMediaVideos(defaultMediaVideos);
    }

    // Load Events from API
`;
    content = content.substring(0, videosStart) + newChunk + content.substring(fetchEventsStart);
    fs.writeFileSync('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx', content);
    console.log("Fixed Admin.jsx parse error");
} else {
    console.log("Could not find blocks");
}

