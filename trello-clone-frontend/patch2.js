const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The best way to replace this without whitespace woes is finding it using regex ignoring white spaces!
code = code.replace(/boxShadow:\s*snapshot\.isDragging\s*\?\s*'0px 24px 32px rgba\(0,0,0,0\.5\)'\s*:\s*'none',\s*transform:\s*snapshot\.isDragging\s*&&\s*!snapshot\.isDropAnimating\s*&&\s*provided\.draggableProps\.style\?\.transform\s*\?\s*\\$\{\s*provided\.draggableProps\.style\.transform\s*\}\s*rotate\(2deg\)\s*scale\(1\.02\)\\s*:\s*provided\.draggableProps\.style\?\.transform,\s*transition:\s*snapshot\.isDragging\s*\?\s*'background 0\.2s ease, box-shadow 0\.2s ease, border 0\.2s ease'\s*:\s*\[provided\.draggableProps\.style\?\.transition,\s*'background 0\.3s ease, box-shadow 0\.3s ease, transform 0\.2s cubic-bezier\(0\.2, 0, 0, 1\)'\]\.filter\(Boolean\)\.join\('\s*,\s*'\),/, '...provided.draggableProps.style');

code = code.replace(/\.\.\.provided\.draggableProps\.style,\s*width:\s*'280px',/, "width: '280px',");

code = code.replace(/boxShadow:\s*snapshot\.isDragging\s*\?\s*'0px 16px 32px rgba\(0,0,0,0\.5\), 0px 4px 8px rgba\(0,0,0,0\.2\)'\s*:\s*'0px 2px 4px rgba\(0,0,0,0\.1\)',\s*position:\s*'relative',\s*overflow:\s*'hidden',\s*minHeight:\s*'40px',\s*transform:\s*snapshot\.isDragging\s*&&\s*!snapshot\.isDropAnimating\s*&&\s*provided\.draggableProps\.style\?\.transform\s*\?\s*\\$\{\s*provided\.draggableProps\.style\.transform\s*\}\s*rotate\(3deg\)\s*scale\(1\.03\)\\s*:\s*provided\.draggableProps\.style\?\.transform,\s*transition:\s*snapshot\.isDragging\s*\?\s*'background 0\.2s ease, box-shadow 0\.2s ease, border 0\.2s ease'\s*:\s*\[provided\.draggableProps\.style\?\.transition,\s*'background 0\.3s ease, box-shadow 0\.3s ease, transform 0\.2s cubic-bezier\(0\.2, 0, 0, 1\)'\]\.filter\(Boolean\)\.join\('\s*,\s*'\),/, "boxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',\n                              position: 'relative',\n                              overflow: 'hidden',\n                              minHeight: '40px',\n                              ...provided.draggableProps.style,");

code = code.replace(/\.\.\.provided\.draggableProps\.style,\s*background:\s*snapshot\.isDragging/, "background: snapshot.isDragging");

fs.writeFileSync('src/App.tsx', code);
