const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regexBtn = /<button[\s\n]*?onClick=\{\(\) => \{[\s\n]*?setIsAddingList\(true\);[\s\n]*?setNewListTitle\(""\);[\s\n]*?\}\}[\s\n]*?className="flex items-center shadow-lg gap-2 text-sm font-bold[\s\n]*?text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-full[\s\n]*?transition-transform hover:scale-105"[\s\n]*?>[\s\n]*?<Plus size=\{20\} \/>[\s\n]*?Add another list[\s\n]*?<\/button>/;

const newBtn = `<button
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
              >
                <Plus size={20} />
                Add another list
              </button>`;
code = code.replace(regexBtn, newBtn);

const inputRegex = /<input[\s\n]*?autoFocus[\s\n]*?value=\{newListTitle\}[\s\n]*?onChange=\{\(e\) => setNewListTitle\(e\.target\.value\)\}[\s\n]*?onKeyDown=\{\(e\) => \{[\s\n]*?if \(e\.key === "Enter"\) handleAddList\(\);[\s\n]*?\}\}[\s\n]*?placeholder="Enter list title\.\.\."[\s\n]*?className="w-full rounded bg-\[#22272b\] p-2 text-sm[\s\n]*?text-\[#C7D1DB\] border border-blue-500 focus:outline-none focus:ring-2[\s\n]*?focus:ring-blue-500"[\s\n]*?\/>/;

const newInput = `<input
                  autoFocus
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddList();
                  }}
                  placeholder="Enter list title..."
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--surface-3)', padding: '10px 14px', fontSize: '13px', color: 'var(--text-primary)', border: '1px solid var(--accent)', outline: 'none', boxShadow: '0 0 0 3px var(--accent-dim)' }}
                />`;
code = code.replace(inputRegex, newInput);

const wrapRegex = /className="w-72 rounded-xl bg-\[#101204\] p-3 shadow-2xl[\s\n]*?ring-1 ring-slate-700 flex flex-col gap-2"/;
const newWrapRegex = `style={{ width: '288px', borderRadius: 'var(--radius-xl)', background: 'var(--surface-2)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.8)', border: '1px solid var(--border-strong)' }}`;
code = code.replace(wrapRegex, newWrapRegex);


const finalAddListBtn = /className="bg-blue-600 hover:bg-blue-700 text-white px-3[\s\n]*?py-1\.5 rounded text-sm font-medium transition-colors"/;
const finalNewBtn = `style={{ background: 'var(--accent)', color: 'white', fontWeight: 600, borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', border: 'none' }}`;
code = code.replace(finalAddListBtn, finalNewBtn);

const cancelBtn = />[\s\n]*?<X size=\{20\} \/>[\s\n]*?<\/button>/;
const newCancelBtn = `style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', padding: '8px', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--surface-3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}>
                  <X size={20} />
                </button>`;
code = code.replace(/className="text-\[#9fadbc\] hover:bg-\[#282e33\] p-1\.5 rounded"[\s\n]*?>[\s\n]*?<X size=\{20\} \/>[\s\n]*?<\/button>/, newCancelBtn);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed floating buttons to fully match Obsidian')
