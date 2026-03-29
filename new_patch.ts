{/* Label Filters */}
                <div>
                  <div className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Label Colors</div>
                  <div className="space-y-2">
                    {AVAILABLE_COLORS.map(color => (
                      <label key={color} className="flex cursor-pointer items-center gap-3 rounded p-1 hover:bg-slate-700">
                        <input
                          type="checkbox"
                          checked={selectedLabelFilters.includes(color)}
                          onChange={() => toggleLabelFilter(color)}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <div className="h-4 w-full rounded" style={{ backgroundColor: color }} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
