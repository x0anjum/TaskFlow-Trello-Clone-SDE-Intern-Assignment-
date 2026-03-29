const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Fix List Draggable
// Find the exact line and start replacing.
code = code.replace(
      `<Draggable draggableId={list.id} index={index}>
        {(provided) => {
          const listColors = ['#A78BFA', '#F59E0B', '#38B2F8', '#22D3A0'];
          const dotColor = listColors[index % listColors.length];
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ width: '280px', flexShrink: 0, background: 'var(--glass)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', display: 'flex', flexDirection: 'column', height: 'fit-content', maxHeight: '100%', transition: 'border-color 0.2s, background 0.2s', ...provided.draggableProps.style }}
              onDragOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
              onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--glass)'; }}
              onDrop={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--glass)'; }}
            >`,
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
            >`
);

// 2. Fix Card Draggable
code = code.replace(
      `<Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onCardClick(card)}
                            style={{ ...provided.draggableProps.style, background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 12px 12px 20px', cursor: 'grab', position: 'relative', overflow: 'hidden', minHeight: '40px' }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-1)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                            onMouseDown={(e) => { e.currentTarget.style.cursor = 'grabbing'; }}
                            onMouseUp={(e) => { e.currentTarget.style.cursor = 'grab'; }}
                          >`,
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
                              overflow: 'hidden',
                              minHeight: '40px',
                              // Keep this last so React Beautiful Dnd styles take precedence!
                              ...provided.draggableProps.style,
                            }}
                          >`
);


fs.writeFileSync('src/App.tsx', code);
console.log('Fixed draggables logic perfectly.');
