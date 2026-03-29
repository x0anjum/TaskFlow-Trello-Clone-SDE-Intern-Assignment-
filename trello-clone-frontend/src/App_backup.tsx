import { useState, useEffect, useMemo } from "react";
import { LayoutGrid, UserCircle, MoreHorizontal, Plus, Search, Filter, CheckCircle2, AlignLeft, Calendar, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import CardModal from "./components/CardModal";

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

export interface User {
  id: string;
  name: string;
  initials?: string;
  color?: string;
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
  assignees?: User[];
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

const formatDueDate = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

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
      {(provided) => {
        return (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`w-72 flex-shrink-0 rounded-xl bg-[#101204] p-3 h-fit flex flex-col max-h-full`}
        >
          <div className="flex items-center justify-between px-2 pb-3 pt-1 relative">
            <input 
              id={`list-header-input-${list.id}`}
              className="text-sm font-semibold text-[#B6C2CF] bg-transparent border-2 border-transparent focus:border-blue-500 focus:bg-[#22272b] px-2 py-1 rounded w-full outline-none mr-2" 
              defaultValue={list.title}
            />
            <button
              onClick={() => setActiveListMenuId(activeListMenuId === list.id ? null : list.id)}
              className="text-[#B6C2CF] hover:bg-white/10 p-1.5 rounded transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>
            {activeListMenuId === list.id && (
              <div className="absolute left-full -ml-[260px] sm:left-auto sm:-ml-0 sm:right-0 top-10 w-64 bg-[#282e33] rounded-lg shadow-xl z-50 py-2 border border-slate-700 text-[#B6C2CF]">
                <div className="px-4 pb-2 mb-2 border-b border-slate-700 text-sm font-semibold text-center flex justify-center items-center relative">
                    <span className="text-xs text-slate-400">List Actions</span>
                    <button onClick={() => setActiveListMenuId(null)} className="absolute right-2 top-0 p-1 hover:bg-white/10 rounded transition-colors">
                        <X size={14} />
                    </button>
                </div>
                <button
                  onClick={() => {
                      document.getElementById(`list-header-input-${list.id}`)?.focus();
                      setActiveListMenuId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  Rename list
                </button>
                <button
                  onClick={() => {
                      setAddingCardToListId(list.id);
                      setActiveListMenuId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  Add card...
                </button>
                <hr className="my-2 border-slate-700" />
                <button
                  onClick={() => {
                    handleDeleteList(list.id);
                    setActiveListMenuId(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white transition-colors"
                >
                  Delete list
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
                        className="rounded-lg bg-[#22272b] text-sm text-[#C7D1DB] shadow-sm hover:ring-2 hover:ring-blue-500 cursor-pointer flex overflow-hidden min-h-[40px]"
                      >
                        {card.labels && card.labels.length > 0 && (
                           <div className="flex shrink-0">
                             {card.labels.map(l => (
                               <div title={l.title} key={l.id} className="w-2 h-full" style={{ backgroundColor: l.color }} >
                               </div>
                             ))}
                           </div>
                        )}
                        <div className="p-3 flex flex-col gap-1.5 flex-1 min-w-0">
                          <span className="break-words">{card.title}</span>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex flex-wrap items-center gap-3 text-slate-400">
                            {card.dueDate && (
                              <div className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded bg-slate-700/50 text-[#C7D1DB] w-fit">
                                <Calendar size={12} />
                                <span>{formatDueDate(card.dueDate)}</span>
                              </div>
                            )}
                            {card.description && (
                              <div className="flex items-center gap-1">
                                <AlignLeft size={14} />
                              </div>
                            )}
                            {card.checklists && card.checklists.length > 0 && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 size={14} />
                                <span className="text-xs">
                                  {card.checklists.filter(i => i.isCompleted).length}/{card.checklists.length}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {card.assignees && card.assignees.length > 0 && (
                            <div className="flex items-center -space-x-1">
                              {card.assignees.map(user => (
                                <div 
                                  key={user.id} 
                                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] text-white font-medium ring-2 ring-[#22272b]"
                                  style={{ backgroundColor: user.color || '#3b82f6' }}
                                  title={user.name}
                                >
                                  {user.initials || user.name.substring(0, 2).toUpperCase()}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        </div>
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
        );
      }}
    </Draggable>
  );
};

function App() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabelFilters, setSelectedLabelFilters] = useState<string[]>([]);
  const [selectedMemberFilters, setSelectedMemberFilters] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<'overdue' | 'nextDay' | 'hasDate' | 'noDate' | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Users state
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then(res => res.json())
      .then(data => setAllUsers(data))
      .catch(console.error);
  }, []);

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
  }, [board, searchQuery, selectedLabelFilters, selectedMemberFilters, dueDateFilter]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await fetch("http://localhost:4000/boards");
        const boards = await response.json();

        if (boards && boards.length > 0) {
          const boardResponse = await fetch(`http://localhost:4000/boards/${boards[0].id}`);
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

  const toggleMemberFilter = (userId: string) => {
    setSelectedMemberFilters(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const activeFiltersCount = selectedLabelFilters.length + selectedMemberFilters.length + (dueDateFilter ? 1 : 0);

  const onDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination || !board) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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
      const response = await fetch(`http://localhost:4000/cards`, {
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
      const response = await fetch(`http://localhost:4000/lists`, {
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
      await fetch(`http://localhost:4000/lists/${listId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">Loading...</div>;
  if (!board) return <div className="min-h-screen flex items-center justify-center bg-[#31796d] text-white">No board found.</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#31796d] overflow-hidden">
      <header className="flex items-center justify-between bg-[#1d2125] border-b border-[#3b444c] px-6 py-4 text-slate-100 flex-shrink-0">
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

      <div className="flex items-center justify-between bg-black/20 backdrop-blur-sm px-6 py-3 text-slate-100 flex-shrink-0">
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
              className={`flex h-9 items-center gap-2 rounded-md px-3 text-sm transition-colors border ${
                activeFiltersCount > 0 || isFilterOpen
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            {isFilterOpen && (
              <div className="absolute right-0 top-11 z-10 w-72 rounded-md bg-slate-800 p-4 shadow-xl ring-1 ring-slate-700 max-h-[80vh] overflow-y-auto">
                
                {/* Member Filters */}
                {allUsers.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Members</div>
                    <div className="space-y-2">
                      {allUsers.map(user => (
                        <label key={user.id} className="flex cursor-pointer items-center gap-3 rounded p-1 hover:bg-slate-700">
                          <input
                            type="checkbox"
                            checked={selectedMemberFilters.includes(user.id)}
                            onChange={() => toggleMemberFilter(user.id)}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                          />
                          <div 
                            className="h-6 w-6 rounded-full flex shrink-0 items-center justify-center text-[10px] text-white font-medium"
                            style={{ backgroundColor: user.color || '#3b82f6' }}
                          >
                            {user.initials || user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-200 truncate">{user.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Date Filters */}
                <div className="mb-4">
                  <div className="mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Due Date</div>
                  <div className="space-y-2">
                    {[
                      { id: 'noDate', label: 'No due date' },
                      { id: 'hasDate', label: 'Has due date' },
                      { id: 'overdue', label: 'Overdue' },
                      { id: 'nextDay', label: 'Due in the next day' }
                    ].map(filterOption => (
                      <label key={filterOption.id} className="flex cursor-pointer items-center gap-3 rounded p-1 hover:bg-slate-700">
                        <input
                          type="checkbox"
                          checked={dueDateFilter === filterOption.id}
                          onChange={() => setDueDateFilter(dueDateFilter === filterOption.id ? null : filterOption.id as any)}
                          className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                        />
                        <span className="text-sm text-slate-200">{filterOption.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

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

      
<main 
        className="flex-1 flex items-start overflow-x-auto h-full bg-[#31796d] px-6 py-6"
        style={board.backgroundImage ? { backgroundImage: `url(${board.backgroundImage})`, backgroundSize: 'cover' } : {}}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div 
                className="flex gap-4 h-full items-start"
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

                {/* Add another list button */}
                {isAddingList ? (
                  <div className="w-72 flex-shrink-0 rounded-xl bg-[#101204] p-3 h-fit flex flex-col gap-2">
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
                    className="flex items-center gap-2 w-72 flex-shrink-0 text-sm font-semibold text-white/80 hover:bg-white/30 bg-white/20 p-3 rounded-xl transition-colors backdrop-blur-sm h-fit text-left shadow-sm"
                  >
                    <Plus size={16} />
                    Add another list
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
