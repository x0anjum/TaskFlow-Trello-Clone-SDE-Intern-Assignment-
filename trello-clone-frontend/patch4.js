const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let out = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
    // skip the old spread line
    // but ONLY when it's immediately after the opening style={{ brace.
    if (lines[i].includes('...provided.draggableProps.style,')) {
        continue;
    }
    
    // skip the transform block
    if (lines[i].includes('transform: snapshot.isDragging && !snapshot.isDropAnimating')) {
        skip = true;
        continue;
    }
    if (skip && lines[i].includes('transition: snapshot.isDragging')) {
        continue; 
    }
    if (skip && lines[i].includes('? \'background 0.2s ease')) {
        continue;
    }
    if (skip && lines[i].includes(' filter(Boolean).join')) {
        skip = false;
        continue;
    }
    if (skip) continue; // safety to aggressively skip if my conditions don't reset skip appropriately. Wait no, if skip is true, and none match, it would have been dropped.
    
    // Fix boxShadow for List
    if (lines[i].includes('0px 24px 32px rgba(0,0,0,0.5)')) {
        out.push(\              ...provided.draggableProps.style\);
        continue;
    }
    
    // Fix boxShadow for Card
    if (lines[i].includes('0px 16px 32px rgba(0,0,0,0.5)')) {
        out.push(\                            boxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',\);
        continue;
    }
    
    // Add the spread back right after minHeight
    if (lines[i].includes(\minHeight: '40px',\)) {
        out.push(lines[i]);
        out.push(\                            ...provided.draggableProps.style,\);
        continue;
    }
    
    out.push(lines[i]);
}

fs.writeFileSync('src/App.tsx', out.join('\n'));
