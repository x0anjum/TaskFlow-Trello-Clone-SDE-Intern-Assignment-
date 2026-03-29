const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For List
let shadow1 = code.indexOf(\oxShadow: snapshot.isDragging ? '0px 24px 32px rgba(0,0,0,0.5)' : 'none',\);
let trans1 = code.indexOf(\	ransform: snapshot.isDragging && !snapshot.isDropAnimating && provided.draggableProps.style?.transform\);
let trans1End = code.indexOf(\').filter(Boolean).join(', '),\, trans1) + \').filter(Boolean).join(', '),\.length;

if (shadow1 > -1 && trans1 > -1) {
    code = code.substring(0, shadow1) + '...provided.draggableProps.style' + code.substring(trans1End);
    code = code.replace(\...provided.draggableProps.style,\n              width: '280px',\, \width: '280px',\);
}

// For Card
let shadow2 = code.indexOf(\oxShadow: snapshot.isDragging ? '0px 16px 32px rgba(0,0,0,0.5), 0px 4px 8px rgba(0,0,0,0.2)' : '0px 2px 4px rgba(0,0,0,0.1)',\);
let trans2 = code.indexOf(\	ransform: snapshot.isDragging && !snapshot.isDropAnimating && provided.draggableProps.style?.transform\, shadow2);
let trans2End = code.indexOf(\').filter(Boolean).join(', '),\, trans2) + \').filter(Boolean).join(', '),\.length;

if (shadow2 > -1 && trans2 > -1) {
    code = code.substring(0, shadow2) + \oxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',\n                              position: 'relative',\n                              overflow: 'hidden',\n                              minHeight: '40px',\n                              ...provided.draggableProps.style,\ + code.substring(trans2End);
    code = code.replace(\...provided.draggableProps.style,\n                              background: snapshot.isDragging ? 'var(--surface-4)' : 'var(--surface-2)',\, \ackground: snapshot.isDragging ? 'var(--surface-4)' : 'var(--surface-2)',\);
}

fs.writeFileSync('src/App.tsx', code);
