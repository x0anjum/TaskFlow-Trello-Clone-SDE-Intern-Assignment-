const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const filePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
  console.log(`Restored: ${file}`);
};

// 1. App.tsx
write('trello-clone-frontend/src/App.tsx', `
import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, UserCircle, MoreHorizontal, Plus, Search, Filter } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { CardModal } from "./components/CardModal";

export interface Label {
  id: string;
  color: string;
  title?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  order: number;
  listId: string;
  dueDate?: string;
  labels?: Label[];
  checklists?: ChecklistItem[];
}

interface List {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: Card[];
}

interface Board {
  id: string;
  title: string;
  backgroundImage?: string;
  lists: List[];
}

const ListComponent = ({ 
  list, 
  index, 
  onCardClick,
  addingCardToListId,
  setAddingCardToListId,
  newCardTitle,
  setNewCardTitle,
  handleAddCard,
  activeListMenuId,
  setActiveListMenuId,
  handleDeleteList
}: { 
  list: List; 
  index: number; 
  onCardClick: (card: Card) => void;
  addingCardToListId: string | null;
  setAddingCardToListId: (id: string | null) => void;
  newCardTitle: string;
  setNewCardTitle: (title: string) => void;
  handleAddCard: (listId: string) => void;
  activeListMenuId: string | null;
  setActiveListMenuId: (id: string | null) => void;
  handleDeleteList: (id: string) => void;
}) => {
  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="w-72 flex-shrink-0 rounded-xl bg-[#101204] p-3 h-fit flex flex-col max-h-full"
        >
          <div className="flex items-center justify-between px-2 pb-3 pt-1 relative">
            <h3 className="text-sm font-semibold text-[#B6C2CF]">{list.title}</h3>
            <button 
              onClick={() => setActiveListMenuId(activeListMenuId === list.id ? null : list.id)}
              className="text-[#B6C2CF] hover:bg-white/10 p-1 rounded"
            >
              <MoreHorizontal size={16} />
            </button>
            {activeListMenuId === list.id && (
              <div className="absolute right-0 top-8 w-48 bg-[#282e33] rounded shadow-xl z-50 p-2 border border-slate-700">
                <button
                  onClick={() => {
                    handleDeleteList(list.id);
                    setActiveListMenuId(null);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-red-600 hover:text-white rounded transition-colors"
                >
                  Delete List
                </button>
              </div>
            )}
          </div>
          
          <Droppable droppableId={list.id} type="card">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 min-h-[2px]"
              >
                {list.cards?.map((card, cardIndex) => (
                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onCardClick(card)}
                        className="rounded-lg bg-[#22272b] p-3 text-sm text-[#C7D1DB] shadow-sm hover:ring-2 hover:ring-blue-500 cursor-pointer"
                      >
                        {card.labels && card.labels.length > 0 && (
                           <div className="flex flex-wrap gap-1 mb-1.5">
                             {card.labels.map(l => (
                               <div key={l.id} className="h-2 w-8 rounded-full" style={{ backgroundColor: l.color }} />
                             ))}
                           </div>
                        )}
                        {card.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {addingCardToListId === list.id ? (
            <div className="mt-2 flex flex-col gap-2 px-2 pb-2">
              <textarea
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddCard(list.id);
                  }
                }}
                placeholder="Enter a title for this card..."
                className="w-full rounded-lg bg-[#22272b] p-2 text-sm text-[#C7D1DB] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddCard(list.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  Add card
                </button>
                <button
                  onClick={() => {
                    setAddingCardToListId(null);
                    setNewCardTitle("");
                  }}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => {
                setAddingCardToListId(list.id);
                setNewCardTitle("");
              }}
              className="flex items-center gap-2 mt-2 px-2 py-2 text-sm text-[#B6C2CF] font-medium hover:bg-white/10 rounded-md transition-colors w-full text-left"
            >
              <Plus size={16} />
              Add a card
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
};

function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabelFilters, setSelectedLabelFilters] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Creation States
  const [addingCardToListId, setAddingCardToListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const [activeListMenuId, setActiveListMenuId] = useState<string | null>(null);

  const AVAILABLE_COLORS = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", 
    "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899"
  ];

  const filteredLists = useMemo(() => {
    if (!board) return [];

    return board.lists.map(list => {
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

        return true;
      });

      return {
        ...list,
        cards: filteredCards
      };
    });
  }, [board, searchQuery, selectedLabelFilters]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch("http://localhost:4000/boards");
        const boards = await response.json();
        
        if (boards && boards.length > 0) {
          const boardResponse = await fetch(\`http://localhost:4000/boards/\${boards[0].id}\`);
          const defaultBoard = await boardResponse.json();
          setBoard(defaultBoard);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, []);

  const toggleLabelFilter = (color: string) => {
    setSelectedLabelFilters(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    if (!board) return;

    if (type === "list") {
      const newLists = Array.from(board.lists);
      const [removed] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, removed);

      setBoard({ ...board, lists: newLists });

      const payload = newLists.map((list, index) => ({ id: list.id, order: index }));
      fetch("http://localhost:4000/lists/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Failed to reorder lists:", err));
      return;
    }

    if (type === "card") {
      const sourceListIndex = board.lists.findIndex(l => l.id === source.droppableId);
      const destListIndex = board.lists.findIndex(l => l.id === destination.droppableId);

      if (sourceListIndex === -1 || destListIndex === -1) return;

      const sourceList = board.lists[sourceListIndex];
      const destList = board.lists[destListIndex];

      const sourceCards = Array.from(sourceList.cards || []);
      const destCards = sourceList.id === destList.id ? sourceCards : Array.from(destList.cards || []);

      const [removedCard] = sourceCards.splice(source.index, 1);
      removedCard.listId = destination.droppableId;
      
      destCards.splice(destination.index, 0, removedCard);

      const newLists = Array.from(board.lists);
      if (sourceList.id === destList.id) {
        newLists[sourceListIndex] = { ...sourceList, cards: sourceCards };
      } else {
        newLists[sourceListIndex] = { ...sourceList, cards: sourceCards };
        newLists[destListIndex] = { ...destList, cards: destCards };
      }

      setBoard({ ...board, lists: newLists });

      const payload = destCards.map((card, index) => ({ 
        id: card.id, 
        order: index, 
        listId: destination.droppableId 
      }));

      if (sourceList.id !== destList.id) {
        payload.push(
          ...sourceCards.map((card, index) => ({
            id: card.id,
            order: index,
            listId: source.droppableId
          }))
        );
      }

      fetch("http://localhost:4000/cards/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Failed to reorder cards:", err));
      return;
    }
  };

  const handleUpdateCard = async (updatedCard: Card) => {
    if (!board) return;
    
    // Update locally
    const newLists = board.lists.map(list => {
      if (list.id === updatedCard.listId) {
        return {
          ...list,
          cards: list.cards.map(card => card.id === updatedCard.id ? updatedCard : card)
        };
      }
      return list;
    });
    
    setBoard({ ...board, lists: newLists });
    if (selectedCard?.id === updatedCard.id) {
      setSelectedCard(updatedCard);
    }
  };

  const handleAddCard = async (listId: string) => {
    if (!newCardTitle.trim() || !board) return;

    const list = board.lists.find(l => l.id === listId);
    const maxOrder = list?.cards?.reduce((max, card) => Math.max(max, card.order), -1) ?? -1;

    try {
      const response = await fetch(\`http://localhost:4000/cards\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCardTitle, listId, order: maxOrder + 1 }),
      });
      const newCard = await response.json();

      const newLists = board.lists.map(l => {
        if (l.id === listId) {
          return { ...l, cards: [...(l.cards || []), newCard] };
        }
        return l;
      });

      setBoard({ ...board, lists: newLists });
      setAddingCardToListId(null);
      setNewCardTitle("");
    } catch (error) {
      console.error("Failed to add card", error);
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim() || !board) return;

    try {
      const response = await fetch(\`http://localhost:4000/lists\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newListTitle, boardId: board.id, order: board.lists.length }),
      });
      const newList = await response.json();

      setBoard({ ...board, lists: [...board.lists, { ...newList, cards: [] }] });
      setIsAddingList(false);
      setNewListTitle("");
    } catch (error) {
      console.error("Failed to add list", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!board) return;

    // Optimistic UI update
    setBoard({
      ...board,
      lists: board.lists.filter(list => list.id !== listId)
    });

    try {
      await fetch(\`http://localhost:4000/lists/\${listId}\`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  if (!board) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">No board found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 overflow-hidden">
      <header className="flex items-center justify-between bg-slate-800 px-6 py-4 text-slate-100 flex-shrink-0">
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
      </header>

      <div className="flex items-center justify-between bg-slate-900/60 px-6 py-3 text-slate-100 flex-shrink-0">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-300">Board Details</p>
          <h2 className="text-lg font-semibold">{board.title}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 rounded-md bg-slate-800 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 w-64"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={\`flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors border \${
                selectedLabelFilters.length > 0 || isFilterOpen
                  ? "bg-slate-700 border-slate-600 text-white" 
                  : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }\`}
            >
              <Filter className="h-4 w-4" />
              Filter {selectedLabelFilters.length > 0 && \`(\${selectedLabelFilters.length})\`}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-11 z-10 w-48 rounded-md bg-slate-800 p-3 shadow-xl ring-1 ring-slate-700">
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
            )}
          </div>
        </div>
      </div>

      <main 
        className="flex-1 overflow-y-auto relative bg-[#1d2125] px-6 py-6"
        style={board.backgroundImage ? { backgroundImage: \`url(\${board.backgroundImage})\`, backgroundSize: 'cover' } : {}}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="list" direction="vertical">
            {(provided) => (
              <div 
                className="flex flex-wrap gap-4 items-start pb-24"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredLists?.map((list, index) => (
                  <ListComponent 
                    key={list.id} 
                    list={list} 
                    index={index} 
                    onCardClick={setSelectedCard} 
                    addingCardToListId={addingCardToListId}
                    setAddingCardToListId={setAddingCardToListId}
                    newCardTitle={newCardTitle}
                    setNewCardTitle={setNewCardTitle}
                    handleAddCard={handleAddCard}
                    activeListMenuId={activeListMenuId}
                    setActiveListMenuId={setActiveListMenuId}
                    handleDeleteList={handleDeleteList}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Fixed 'Add another list' button */}
        <div className="fixed bottom-8 right-8 z-40 shadow-2xl">
          {isAddingList ? (
            <div className="w-72 rounded-xl bg-[#101204] p-3 shadow-2xl ring-1 ring-slate-700 flex flex-col gap-2">
              <input
                autoFocus
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddList();
                }}
                placeholder="Enter list title..."
                className="w-full rounded bg-[#22272b] p-2 text-sm text-[#C7D1DB] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddList}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                >
                  Add list
                </button>
                <button
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle("");
                  }}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => {
                setIsAddingList(true);
                setNewListTitle("");
              }}
              className="flex items-center shadow-lg gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-full transition-transform hover:scale-105"
            >
              <Plus size={20} />
              Add another list
            </button>
          )}
        </div>
      </main>

      {selectedCard && (
        <CardModal 
          card={selectedCard} 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)} 
          onUpdateCard={handleUpdateCard} 
        />
      )}
    </div>
  );
}

export default App;
`);
