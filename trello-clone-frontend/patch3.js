const fs = require('fs');
let lines = fs.readFileSync('src/App.tsx', 'utf8').split('\n');
let out = [];
let skip = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('...provided.draggableProps.style,')) {
        continue;
    }
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
    if (skip && lines[i].includes(': [provided.draggableProps.style?.transition')) {
        skip = false;
        continue;
    }
    
    // Fix boxShadow for List
    if (lines[i].includes(\oxShadow: snapshot.isDragging ? '0px 24px 32px rgba(0,0,0,0.5)' : 'none',\)) {
        out.push(\              ...provided.draggableProps.style\);
        continue;
    }
    
    // Fix boxShadow for Card
    if (lines[i].includes(\oxShadow: snapshot.isDragging ? '0px 16px 32px rgba(0,0,0,0.5), 0px 4px 8px rgba(0,0,0,0.2)' : '0px 2px 4px rgba(0,0,0,0.1)',\)) {
        out.push(lines[i].replace(\oxShadow: snapshot.isDragging ? '0px 16px 32px rgba(0,0,0,0.5), 0px 4px 8px rgba(0,0,0,0.2)' : '0px 2px 4px rgba(0,0,0,0.1)',\, \oxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',\));
        continue;
    }
    
    if (lines[i].includes(\minHeight: '40px',\)) {
        out.push(lines[i]);
        out.push(\                              ...provided.draggableProps.style,\);
        continue;
    }
    
    out.push(lines[i]);
}

fs.writeFileSync('src/App.tsx', out.join('\n'));
