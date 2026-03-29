const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const listOldStart = `<Draggable draggableId={list.id} index={index}>
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
          >`;

const listNewStart = `<Draggable draggableId={list.id} index={index}>
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
              background: snapshot.isDragging ? 'var(--surface-2)' : 'var(--glass)',
              backdropFilter: snapshot.isDragging ? 'blur(16px)' : 'blur(12px)',
              border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', 
              display: 'flex', 
              flexDirection: 'column', 
              height: 'fit-content', 
              maxHeight: '100%',
              ...provided.draggableProps.style,
              transition: provided.draggableProps.style?.transition ? provided.draggableProps.style.transition + ', border-color 0.2s, background 0.2s, filter 0.2s, box-shadow 0.2s' : 'border-color 0.2s, background 0.2s, filter 0.2s, box-shadow 0.2s',
              boxShadow: snapshot.isDragging ? '0 20px 40px -12px rgba(0,0,0,0.5), 0 0 0 1px var(--accent-dim)' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              transform: snapshot.isDragging ? provided.draggableProps.style?.transform + ' scale(1.02)' : provided.draggableProps.style?.transform,
              zIndex: snapshot.isDragging ? 999 : 1
            }}
          >`;

code = code.replace(listOldStart, listNewStart);

fs.writeFileSync('src/App.tsx', code);
console.log('List Draggable updated successfully.');
