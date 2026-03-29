const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The string we want to remove from Card Draggable
const cardBadEvents = `                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                          onMouseDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; }}
                          onMouseUp={(e) => { e.currentTarget.style.cursor = 'grab'; }}`;

code = code.replace(cardBadEvents, "");

// Check For List Draggable
const listEventsSearch = code.indexOf('<Draggable draggableId={list.id} index={index}>');
if (listEventsSearch !== -1) {
   console.log(code.substring(listEventsSearch, listEventsSearch + 800));
}

fs.writeFileSync('src/App.tsx', code);
console.log("Card Bad Events removed.");
