const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const badStyle = "style={{ ...provided.draggableProps.style, background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 12px 12px 20px', cursor: 'grab', position: 'relative', overflow: 'hidden', minHeight: '40px' }}";

const goodStyle = "style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 12px 12px 20px', cursor: 'grab', position: 'relative', overflow: 'hidden', minHeight: '40px', ...provided.draggableProps.style }}";

code = code.replace(badStyle, goodStyle);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed Card Draggable Style!");
