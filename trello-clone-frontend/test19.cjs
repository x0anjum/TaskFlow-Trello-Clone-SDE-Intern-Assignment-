const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// For safely doing add another list
code = code.replace(
      `<button
                onClick={() => {
                  setIsAddingList(true);
                  setNewListTitle("");
                }}
                className="flex items-center shadow-lg gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-full transition-transform hover:scale-105"
              >`,
      `<button
                onClick={() => {
                  setIsAddingList(true);
                  setNewListTitle("");
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#fff',
                  background: 'linear-gradient(135deg, var(--accent), #4f46e5)', padding: '12px 24px', borderRadius: 'var(--radius-full)',
                  boxShadow: '0 8px 16px -4px rgba(108, 99, 255, 0.4), 0 4px 8px -4px rgba(108, 99, 255, 0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 12px 20px -4px rgba(108, 99, 255, 0.6)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(108, 99, 255, 0.4), 0 4px 8px -4px rgba(108, 99, 255, 0.3)'; }}
              >`
);

code = code.replace(
      `<div className="w-72 rounded-xl bg-[#101204] p-3 shadow-2xl ring-1 ring-slate-700 flex flex-col gap-2">`,
      `<div style={{ width: '288px', borderRadius: 'var(--radius-xl)', background: 'var(--surface-2)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)', border: '1px solid var(--border-strong)' }}>`
);

code = code.replace(
      `<button
                    onClick={handleAddList}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  >`,
      `<button
                    onClick={handleAddList}
                    style={{ background: 'var(--accent)', color: 'white', fontWeight: 600, borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', border: 'none' }}
                  >`
);

code = code.replace(
      `<button
                    onClick={() => setIsAddingList(false)}
                    className="text-[#9fadbc] hover:bg-[#282e33] p-1.5 rounded"
                  >`,
      `<button
                    onClick={() => setIsAddingList(false)}
                    style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--surface-3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                  >`
);

code = code.replace(
      `<input
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                  }}
                  placeholder="Enter list title..."
                  className="w-full rounded bg-[#22272b] p-2 text-sm text-[#C7D1DB] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />`,
      `<input
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                  }}
                  placeholder="Enter list title..."
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--surface-3)', padding: '10px 14px', fontSize: '13px', color: 'var(--text-primary)', border: '1px solid var(--accent)', outline: 'none', boxShadow: '0 0 0 3px var(--accent-dim)' }}
                />`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Floating UI styled!");
