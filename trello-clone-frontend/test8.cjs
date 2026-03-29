const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Ensure provided.draggableProps.style is truly taking effect
const fixedStr = "style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 12px 12px 20px', cursor: 'grab', position: 'relative', overflow: 'hidden', minHeight: '40px', ...provided.draggableProps.style }}";

if (!code.includes(fixedStr)) {
    console.log("WAIT style replacement failed.");
    console.log(code.substring(code.indexOf('key={card.id}>'), code.indexOf('key={card.id}>') + 500));
} else {
    console.log("STYLE REPLACEMENT SUCCESS.");
}
