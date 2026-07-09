const fs = require('fs');
const filepath = 'd:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx';
let file = fs.readFileSync(filepath, 'utf8');

const start = file.indexOf('useEffect(() => {');
const end = file.indexOf('}, []);', start);

if (start !== -1 && end !== -1) {
    let useEffectContent = file.substring(start, end);
    
    // Replace all settingsService.set calls in this block
    useEffectContent = useEffectContent.replace(/settingsService\.set\([\s\S]*?\);/g, '// removed initialization set call');
    
    file = file.substring(0, start) + useEffectContent + file.substring(end);
    fs.writeFileSync(filepath, file, 'utf8');
    console.log('Successfully removed initialization settingsService calls from useEffect.');
} else {
    console.log('Could not find useEffect block.');
}
