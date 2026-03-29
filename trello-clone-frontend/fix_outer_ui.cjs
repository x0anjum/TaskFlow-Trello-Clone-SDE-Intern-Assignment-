const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. App Header Wrapper
code = code.replace(
  /<header[\s\S]*?className="flex items-center justify-between bg-\[#1d2125\][\s\S]*?>[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<div className="flex h-10 w-10 items-center justify-center[\s\S]*?bg-slate-700">[\s\S]*?<LayoutGrid className="h-6 w-6" \/>[\s\S]*?<\/div>[\s\S]*?<span className="text-lg font-semibold">TaskFlow<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<span className="text-sm text-slate-300">Default User<\/span>[\s\S]*?<UserCircle className="h-9 w-9 text-slate-200" \/>[\s\S]*?<\/div>[\s\S]*?<\/header>/,
  `<header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '16px 24px', flexShrink: 0, height: '64px' }}>
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
      </header>`
);

// 2. Sub Header (Board Details) Background Wrapper
code = code.replace(
  /<div className="flex items-center justify-between bg-black\/20[\s\S]*?px-6 py-3 text-slate-100 flex-shrink-0">/,
  `<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: '12px 24px', flexShrink: 0, height: '60px' }}>`
);

// 3. Sub Header Text Data (Board Details & Title)
code = code.replace(
  /<div>[\s\S]*?<p className="text-xs uppercase tracking-wide text-slate-300">Board Details<\/p>[\s\S]*?<h2 className="text-lg font-semibold">\{board\.title\}<\/h2>[\s\S]*?<\/div>/,
  `<div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Board Details</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{board.title}</h2>
        </div>`
);

// 4. Also double-check main tag styling
code = code.replace(
    /<main[\s\S]*?className="flex-1 flex items-start overflow-x-auto h-full[\s\S]*?bg-transparent px-6 py-6"/,
    `<main style={{ flex: 1, display: 'flex', alignItems: 'flex-start', overflowX: 'auto', height: '100%', padding: '24px', background: 'transparent' }}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed outer headers using robust regex!');
