const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the main tag styles
const mainRegex = /<main[\s\S]*?className="flex-1 flex items-start overflow-x-auto h-full[\s\S]*?bg-\[#31796d\] px-6 py-6"/;
const newMain = `<main
          style={{ flex: 1, display: 'flex', alignItems: 'flex-start', overflowX: 'auto', height: '100%', padding: '24px', background: 'transparent' }}`;

code = code.replace(mainRegex, newMain);

// Let's also check for any residual bg-[#31796d]
code = code.replace(/bg-\[#31796d\]/g, "");

fs.writeFileSync('src/App.tsx', code);
console.log("Main wrapper fixed!");
