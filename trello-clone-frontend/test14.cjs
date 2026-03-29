const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The old main wrappers:
const oldBackground1 = '<div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">Loading...</div>';
const newBackground1 = '<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>Loading...</div>';

const oldBackground2 = '<div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">No board found.</div>';
const newBackground2 = '<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>No board found.</div>';

const mainRegex = /<div className="min-h-screen flex flex-col bg-\[#31796d\] overflow-hidden">[\s\S]*?<header className="flex items-center justify-between bg-\[#1d2125\] border-b border-\[#3b444c\] px-6 py-4 text-slate-100 flex-shrink-0">[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700">[\s\S]*?<LayoutGrid className="h-6 w-6" \/>[\s\S]*?<\/div>[\s\S]*?<span className="text-lg font-semibold">TaskFlow<\/span>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-3">[\s\S]*?<span className="text-sm text-slate-300">Default User<\/span>[\s\S]*?<UserCircle className="h-9 w-9 text-slate-200" \/>[\s\S]*?<\/div>[\s\S]*?<\/header>[\s\S]*?<div className="flex items-center justify-between bg-black\/20 backdrop-blur-sm px-6 py-3 text-slate-100 flex-shrink-0">/;


const newWrapper = `<div className="min-h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-0)', borderBottom: '1px solid var(--border)', padding: '16px 24px', flexShrink: 0, height: '64px' }}>
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
      </header>

      {/* Board Secondary Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-1)', borderBottom: '1px solid var(--border)', padding: '12px 24px', flexShrink: 0, height: '60px' }}>`;

code = code.replace(oldBackground1, newBackground1);
code = code.replace(oldBackground2, newBackground2);
code = code.replace(mainRegex, newWrapper);


const oldBoardDetails = /<div>[\s\S]*?<p className="text-xs uppercase tracking-wide text-slate-300">Board Details<\/p>[\s\S]*?<h2 className="text-lg font-semibold">\{board\.title\}<\/h2>[\s\S]*?<\/div>[\s\S]*?<div className="flex items-center gap-4">[\s\S]*?<div className="relative">[\s\S]*?<Search className="absolute left-2\.5 top-2\.5 h-4 w-4 text-slate-400" \/>[\s\S]*?<input[\s\S]*?type="text"[\s\S]*?placeholder="Search cards..."[\s\S]*?value=\{searchQuery\}[\s\S]*?onChange=\{\(e\) => setSearchQuery\(e\.target\.value\)\}[\s\S]*?className="h-9 rounded-md bg-slate-800 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 w-64"[\s\S]*?\/>[\s\S]*?<\/div>[\s\S]*?<div className="relative">/;

const newBoardDetails = `<div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Board Details</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{board.title}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ height: '36px', borderRadius: 'var(--radius-full)', background: 'var(--surface-3)', paddingLeft: '36px', paddingRight: '16px', fontSize: '13px', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none', width: '260px', transition: 'all 0.2s' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-dim)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ position: 'relative' }}>`;

code = code.replace(oldBoardDetails, newBoardDetails);

// Filter Button Update
const filterRegex = /<button[\s\S]*?onClick=\{\(\) => setIsFilterOpen\(!isFilterOpen\)\}[\s\S]*?className=\{`flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors border \$\{[\s\S]*?activeFiltersCount > 0 \|\| isFilterOpen[\s\S]*?\? "bg-slate-700 border-slate-600 text-white"[\s\S]*?: "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"[\s\S]*?`\}[\s\S]*?>/;

const newFilter = `<button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                display: 'flex', height: '36px', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-full)', padding: '0 16px', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer',
                background: activeFiltersCount > 0 || isFilterOpen ? 'var(--accent)' : 'transparent',
                color: activeFiltersCount > 0 || isFilterOpen ? '#fff' : 'var(--text-primary)',
                border: activeFiltersCount > 0 || isFilterOpen ? '1px solid var(--accent)' : '1px solid var(--border)'
              }}
              onMouseEnter={(e) => { if (!(activeFiltersCount > 0 || isFilterOpen)) { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; } }}
              onMouseLeave={(e) => { if (!(activeFiltersCount > 0 || isFilterOpen)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
            >`;

code = code.replace(filterRegex, newFilter);

fs.writeFileSync('src/App.tsx', code);
console.log("App Wrapper Styled to Match Obsidian!");
