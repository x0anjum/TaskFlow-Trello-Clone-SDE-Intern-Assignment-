const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// For Cards
const cardOld = `                            style={{
                              background: snapshot.isDragging ? 'var(--surface-3)' : 'var(--surface-1)',
                              border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
                              borderRadius: 'var(--radius-lg)',
                              padding: '12px 12px 12px 20px',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              position: 'relative',
                              overflow: 'hidden',
                              minHeight: '40px',
                              ...provided.draggableProps.style,
                              transition: provided.draggableProps.style?.transition ? provided.draggableProps.style.transition + ', background 0.2s, border 0.2s, box-shadow 0.2s' : 'background 0.2s, border 0.2s, box-shadow 0.2s',
                              boxShadow: snapshot.isDragging ? '0 12px 24px -6px rgba(0,0,0,0.5), 0 4px 8px -2px rgba(0,0,0,0.3)' : '0 2px 5px rgba(0,0,0,0.1)',
                              transform: snapshot.isDragging ? provided.draggableProps.style?.transform + ' rotate(3deg) scale(1.02)' : provided.draggableProps.style?.transform,
                            }}`;

const cardNew = `                            style={{
                              background: snapshot.isDragging ? 'var(--surface-3)' : 'var(--surface-1)',
                              border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
                              borderRadius: 'var(--radius-lg)',
                              padding: '12px 12px 12px 20px',
                              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              position: 'relative',
                              overflow: 'hidden',
                              minHeight: '40px',
                              boxShadow: snapshot.isDragging ? '0 12px 24px -6px rgba(0,0,0,0.8), 0 0 0 1px var(--accent)' : '0 2px 5px rgba(0,0,0,0.1)',
                              ...provided.draggableProps.style
                            }}`;

// Replace Card
let newCode = code;
// Make it multiline friendly just in case using regex
newCode = newCode.replace(/style=\{\{[\s\S]*?transform: snapshot\.isDragging \? provided\.draggableProps\.style\?\.transform \+ ' rotate\(3deg\) scale\(1\.02\)' : provided\.draggableProps\.style\?\.transform,\s*\}\}/g, cardNew);


// For List
const listRegex = /style=\{\{\s*width:\s*'280px',\s*flexShrink:\s*0,\s*background:\s*'var\(--glass\)',\s*backdropFilter:\s*'blur\(12px\)',\s*border:\s*'1px solid var\(--border\)',\s*borderRadius:\s*'var\(--radius-xl\)',\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*height:\s*'fit-content',\s*maxHeight:\s*'100%',\s*transition:\s*'border-color 0\.2s, background 0\.2s',\s*\.\.\.provided\.draggableProps\.style\s*\}\}/g;

const listNew = `style={{ width: '280px', flexShrink: 0, background: 'var(--glass)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: '100%', ...provided.draggableProps.style }}`;

newCode = newCode.replace(listRegex, listNew);

fs.writeFileSync('src/App.tsx', newCode);
console.log('Styles cleaned successfully!');
