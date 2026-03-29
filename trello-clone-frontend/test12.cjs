const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace these exactly using more flexible regex
code = code.replace(/onMouseLeave=\{\(e\) => \{ e\.currentTarget\.style\.background = 'var\(--surface-1\)'; e\.currentTarget\.style\.borderColor = 'var\(--border\)'; e\.currentTarget\.style\.boxShadow = 'none'; \}\}/g, "");
code = code.replace(/onMouseDown=\{\(e\) => \{ e\.currentTarget\.style\.cursor = 'grabbing'; \}\}/g, "");
code = code.replace(/onMouseUp=\{\(e\) => \{ e\.currentTarget\.style\.cursor = 'grab'; \}\}/g, "");

fs.writeFileSync('src/App.tsx', code);
console.log('Card bad mouse events removed for real!');
