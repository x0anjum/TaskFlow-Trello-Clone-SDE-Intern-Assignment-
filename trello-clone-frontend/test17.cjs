const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const searchRegex = /<div className="flex items-center gap-4">[\s\S]*?<div className="relative">[\s\S]*?<Search className="absolute left-2\.5 top-2\.5 h-4 w-4[\s\n]*?text-slate-400" \/>[\s\S]*?<input[\s\S]*?type="text"[\s\S]*?placeholder="Search cards\.\.\."[\s\S]*?value=\{searchQuery\}[\s\S]*?onChange=\{\(e\) => setSearchQuery\(e\.target\.value\)\}[\s\S]*?className="h-9 rounded-md bg-slate-800 pl-9 pr-4 text-sm[\s\n]*?text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2[\s\n]*?focus:ring-blue-500 border border-slate-700 w-64"[\s\S]*?\/>[\s\S]*?<\/div>[\s\S]*?<div className="relative">/;

const newSearch = `<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

code = code.replace(searchRegex, newSearch);

const filterRegex = /<button[\s\S]*?onClick=\{\(\) => setIsFilterOpen\(!isFilterOpen\)\}[\s\S]*?className=\{`flex h-9 items-center gap-2 rounded-md px-3[\s\n]*?text-sm transition-colors border \$\{[\s\S]*?selectedLabelFilters\.length > 0 \|\| isFilterOpen[\s\S]*?\? "bg-slate-700 border-slate-600 text-white"[\s\S]*?: "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"[\s\S]*?`\}[\s\S]*?>/;

const newFilter = `<button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                display: 'flex', height: '36px', alignItems: 'center', gap: '8px', borderRadius: 'var(--radius-full)', padding: '0 16px', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer',
                background: selectedLabelFilters.length > 0 || isFilterOpen ? 'var(--accent)' : 'transparent',
                color: selectedLabelFilters.length > 0 || isFilterOpen ? '#fff' : 'var(--text-primary)',
                border: selectedLabelFilters.length > 0 || isFilterOpen ? '1px solid var(--accent)' : '1px solid var(--border)'
              }}
              onMouseEnter={(e) => { if (!(selectedLabelFilters.length > 0 || isFilterOpen)) { e.currentTarget.style.background = 'var(--surface-3)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; } }}
              onMouseLeave={(e) => { if (!(selectedLabelFilters.length > 0 || isFilterOpen)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; } }}
            >`;

code = code.replace(filterRegex, newFilter);

fs.writeFileSync('src/App.tsx', code);
console.log("Search and Filter components fixed!");
