const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// For lists
code = code.replace(
    /<\(provided\) => \(\s*<div\s*ref=\{provided\.innerRef\}\s*\{\.\.\.provided\.draggableProps\}\s*style=\{\{ transition: 'border-color 0\.2s, background 0\.2s', \.\.\.provided\.draggableProps\.style \}\}/,
    `(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style, transition: provided.draggableProps.style?.transition ? provided.draggableProps.style.transition + ', box-shadow 0.2s, transform 0.1s' : 'box-shadow 0.2s, transform 0.1s', transform: snapshot.isDragging ? provided.draggableProps.style?.transform + ' rotate(2deg)' : provided.draggableProps.style?.transform, boxShadow: snapshot.isDragging ? '0 12px 24px -6px rgba(0,0,0,0.4), 0 0 0 1px var(--accent)' : 'none', zIndex: snapshot.isDragging ? 9999 : 1 }}`
);

// For cards
code = code.replace(
    /<Draggable key=\{card\.id\} draggableId=\{card\.id\} index=\{cardIndex\}>\s*\{\(provided\) => \(\s*<div\s*ref=\{provided\.innerRef\}\s*\{\.\.\.provided\.draggableProps\}\s*\{\.\.\.provided\.dragHandleProps\}\s*onClick=\{\(\) => onCardClick\(card\)\}\s*style=\{\{ background: 'var\(--surface-1\)', border: '1px solid var\(--border\)', borderRadius: 'var\(--radius-lg\)', padding: '12px 12px 12px 20px', cursor: 'grab', position: 'relative', overflow: 'hidden', minHeight: '40px', \.\.\.provided\.draggableProps\.style \}\}/g,
    `<Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onCardClick(card)}
                          style={{
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
                          }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Done replacing snapshot and styles');
