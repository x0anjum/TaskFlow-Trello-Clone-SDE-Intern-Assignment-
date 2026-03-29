const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace backgrounds
code = code.replace('<div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">Loading...</div>', '<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>Loading...</div>');

code = code.replace('<div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">No board found.</div>', '<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>No board found.</div>');

code = code.replace('<div className="min-h-screen flex flex-col bg-[#31796d] overflow-hidden">', '<div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>');

// Replace Header exactly
const oldHeader = `<header className="flex items-center justify-between bg-[#1d2125] border-b border-[#3b444c] px-6 py-4 text-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">Default User</span>
          <UserCircle className="h-9 w-9 text-slate-200" />
        </div>
      </header>`;

const newHeader = `<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '16px 24px', flexShrink: 0, height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', height: '36px', width: '36px', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)', background: 'var(--surface-2)', border: '1px solid var(--border)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05)' }}>
            <LayoutGrid size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>Default User</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'var(--surface-3)', border: '1px solid var(--border-strong)' }}>
            <UserCircle size={20} style={{ color: 'var(--text-primary)' }} />
          </div>
        </div>
      </header>`;

code = code.replace(oldHeader, newHeader);


// Sub header
const oldBoardTitle = `<div>
          <p className="text-xs uppercase tracking-wide text-slate-300">Board Details</p>
          <h2 className="text-lg font-semibold">{board.title}</h2>
        </div>`;
const newBoardTitle = `<div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Board Details</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{board.title}</h2>
        </div>`;

code = code.replace(oldBoardTitle, newBoardTitle);

// Replace subheader bg
code = code.replace('<div className="flex items-center justify-between bg-black/20 backdrop-blur-sm px-6 py-3 text-slate-100 flex-shrink-0">', '<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-1)", borderBottom: "1px solid var(--border)", padding: "12px 24px", flexShrink: 0, height: "60px" }}>');

// Main drop zone bg
code = code.replace('<main\n          className="flex-1 flex items-start overflow-x-auto h-full bg-[#31796d] px-6 py-6"', '<main\n          style={{ flex: 1, display: "flex", alignItems: "flex-start", overflowX: "auto", height: "100%", padding: "24px", background: "transparent" }}\n          className=""');


fs.writeFileSync('src/App.tsx', code);
console.log('Fixed outer backgrounds!');
