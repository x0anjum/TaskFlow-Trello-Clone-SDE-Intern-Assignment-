const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix List
code = code.replace(/<Draggable draggableId=\{list\.id\} index=\{index\}>[\s\S]*?\{\(provided\) => \{[\s\S]*?const listColors = \['#A78BFA', '#F59E0B', '#38B2F8', '#22D3A0'\];[\s\S]*?const dotColor = listColors\[index % listColors\.length\];[\s\S]*?return \([\s\S]*?<div[\s\S]*?ref=\{provided\.innerRef\}[\s\S]*?\{\.\.\.provided\.draggableProps\}[\s\S]*?\{\.\.\.provided\.dragHandleProps\}[\s\S]*?style=\{\{.*?\}\}[\s\S]*?onDragOver=\{.*?\}[\s\S]*?onDragLeave=\{.*?\}[\s\S]*?onDrop=\{.*?\}[\s\S]*?>/,
`<Draggable draggableId={list.id} index={index}>
      {(provided, snapshot) => {
        const listColors = ['#A78BFA', '#F59E0B', '#38B2F8', '#22D3A0'];
        const dotColor = listColors[index % listColors.length];
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              width: '280px',
              flexShrink: 0,
              background: snapshot.isDragging ? 'var(--surface-3)' : 'var(--glass)',
              backdropFilter: 'blur(12px)',
              border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              maxHeight: '100%',
              ...provided.draggableProps.style
            }}
          >`);


// Fix Card
code = code.replace(/<Draggable key=\{card\.id\} draggableId=\{card\.id\} index=\{cardIndex\}>[\s\S]*?\{\(provided\) => \([\s\S]*?<div[\s\S]*?ref=\{provided\.innerRef\}[\s\S]*?\{\.\.\.provided\.draggableProps\}[\s\S]*?\{\.\.\.provided\.dragHandleProps\}[\s\S]*?onClick=\{\(\) => onCardClick\(card\)\}[\s\S]*?style=\{\{.*?\}\}[\s\S]*?onMouseLeave=\{.*?\}[\s\S]*?onMouseDown=\{.*?\}[\s\S]*?onMouseUp=\{.*?\}[\s\S]*?>/, 
`<Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onCardClick(card)}
                          style={{
                            background: snapshot.isDragging ? 'var(--surface-4)' : 'var(--surface-2)',
                            border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '12px 12px 12px 20px',
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            boxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '40px',
                            ...provided.draggableProps.style,
                          }}
                        >`);

fs.writeFileSync('src/App.tsx', code);
console.log("Replaced with regex.");
