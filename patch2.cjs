const fs = require('fs');

function patchFile(filepath) {
    let content;
    try {
        content = fs.readFileSync(filepath, 'utf8');
    } catch (e) {
        return;
    }

    // 1. Remove tableLayout: 'fixed' and add minWidth: '1200px'
    content = content.replace(
        /tableLayout:\s*'fixed'/g,
        "tableLayout: 'auto', minWidth: '1300px'"
    );

    // 2. Increase file input width
    content = content.replace(
        /style=\{\{\s*fontSize:\s*'10px',\s*width:\s*'90px'\s*\}\}/g,
        "style={{ fontSize: '11px', width: '105px' }}"
    );

    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Patched ' + filepath);
}

patchFile('d:\\IEEE\\src\\pages\\Admin.jsx');
patchFile('d:\\IEEE\\admin-panel\\src\\pages\\Admin.jsx');
patchFile('d:\\IEEE\\public-website\\src\\pages\\Admin.jsx');
