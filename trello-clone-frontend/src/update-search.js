const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const regex = /const filteredLists = useMemo\(\(\) => \{.+?return board\.lists\.map\(list => \{.+?return \{\s*\.\.\.list,\s*cards: filteredCards\s*\};\s*\}\);\s*\}, \[board, searchQuery, selectedLabelFilters, selectedMemberFilters, dueDateFilter\]\);/s;

const match = code.match(regex);
if (match) {
  const replacement = const filteredLists = useMemo(() => {
    if (!board) return [];

    const isFiltering = Boolean(searchQuery || selectedLabelFilters.length > 0 || selectedMemberFilters.length > 0 || dueDateFilter);

    let processedLists = board.lists.map(list => {
      const filteredCards = (list.cards || []).filter(card => {
        // Condition 1: Search Query
        if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        // Condition 2: Label Filters
        if (selectedLabelFilters.length > 0) {
          const hasMatchingLabel = card.labels?.some(label =>
            selectedLabelFilters.includes(label.color)
          );
          if (!hasMatchingLabel) return false;
        }

        // Condition 3: Member Filters
        if (selectedMemberFilters.length > 0) {
          const hasMatchingMember = card.assignees?.some(user =>
            selectedMemberFilters.includes(user.id)
          );
          if (!hasMatchingMember) return false;
        }

        // Condition 4: Due Date Filters
        if (dueDateFilter) {
          if (dueDateFilter === 'noDate' && card.dueDate) return false;
          if (dueDateFilter === 'hasDate' && !card.dueDate) return false;
          if (dueDateFilter === 'overdue' || dueDateFilter === 'nextDay') {
            if (!card.dueDate) return false;
            const dueTime = new Date(card.dueDate).getTime();
            const now = Date.now();
            if (dueDateFilter === 'overdue') {
              if (dueTime >= now) return false;
            } else if (dueDateFilter === 'nextDay') {
              const nextDay = now + 24 * 60 * 60 * 1000;
              if (dueTime < now || dueTime > nextDay) return false;
            }
          }
        }

        return true;
      });

      return {
        ...list,
        cards: filteredCards
      };
    });

    if (isFiltering) {
      processedLists = processedLists.filter(list => list.cards && list.cards.length > 0);
    }

    return processedLists;
  }, [board, searchQuery, selectedLabelFilters, selectedMemberFilters, dueDateFilter]);;
  
  code = code.replace(regex, replacement);
  fs.writeFileSync('App.tsx', code);
  console.log('Search logic updated!');
} else {
  console.log('Regex match failed!');
}