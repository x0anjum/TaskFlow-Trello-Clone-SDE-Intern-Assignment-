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
  handleDeleteList,
  handleUpdateListTitle,
  isFiltering
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
  handleUpdateListTitle: (listId: string, newTitle: string) => void;
  isFiltering?: boolean;
}) => {
  return (
    <Draggable draggableId={list.id} index={index} isDragDisabled={isFiltering}>
      {(provided, snapshot) => {
        const listColors = ['#A78BFA', '#F59E0B', '#38B2F8', '#22D3A0'];
        const dotColor = listColors[index % listColors.length];
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              width: '280px',
              flexShrink: 0,
              background: snapshot.isDragging ? 'var(--surface-3)' : 'var(--glass)',
              backdropFilter: 'blur(12px)',
              border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              height: 'fit-content',
              maxHeight: '100%',
              ...provided.draggableProps.style
            }}
          >
            <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor }}></div>
                <input
                  id={`list-header-input-${list.id}`}
                  style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', background: 'transparent', border: 'none', outline: 'none', width: '130px' }}
                  defaultValue={list.title}
                  onBlur={(e) => {
                    const newTitle = e.target.value;
                    if (newTitle !== list.title) {
                      handleUpdateListTitle(list.id, newTitle);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                />
                <span style={{ fontSize: '10px', background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-muted)', borderRadius: '20px', padding: '1px 7px' }}>
                  {list.cards?.length || 0}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setActiveListMenuId(activeListMenuId === list.id ? null : list.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <MoreHorizontal size={16} />
                </button>
                {activeListMenuId === list.id && (
                  <div style={{ position: 'absolute', left: 'auto', right: 0, top: '28px', width: '200px', background: 'var(--surface-2)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', zIndex: 50, padding: '8px 0', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    <div style={{ padding: '0 16px 8px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      List Actions
                      <button onClick={() => setActiveListMenuId(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={14} /></button>
                    </div>
                    <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'} onClick={() => { document.getElementById(`list-header-input-${list.id}`)?.focus(); setActiveListMenuId(null); }}>Rename list</button>
                    <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'} onClick={() => { setAddingCardToListId(list.id); setActiveListMenuId(null); }}>Add card...</button>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>
                    <button style={{ width: '100%', textAlign: 'left', padding: '8px 16px', fontSize: '13px', color: 'var(--priority-red)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,77,109,0.1)'} onMouseLeave={(e) => e.currentTarget.style.background = 'none'} onClick={() => { handleDeleteList(list.id); setActiveListMenuId(null); }}>Delete list</button>
                  </div>
                )}
              </div>
            </div>

            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '2px', padding: '10px 10px 0' }}
                >
                  {list.cards?.map((card, cardIndex) => (
                    <Draggable key={card.id} draggableId={card.id} index={cardIndex} isDragDisabled={isFiltering}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onCardClick(card)}
                          style={{
                            background: snapshot.isDragging ? 'var(--surface-4)' : 'var(--surface-2)',
                            border: snapshot.isDragging ? '1px solid var(--accent)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '12px 12px 12px 20px',
                            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                            boxShadow: snapshot.isDragging ? '0px 12px 24px rgba(0,0,0,0.6)' : 'none',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '40px',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)', pointerEvents: 'none' }}></div>
                          {(() => {
                             const pColor = card.labels && card.labels.length > 0 ? card.labels[0].color : 'transparent';
                             const colorMap: any = { '#ef4444': 'var(--priority-red)', '#f97316': 'var(--priority-amber)', '#3b82f6': 'var(--priority-blue)', '#22c55e': 'var(--priority-green)', '#8b5cf6': 'var(--priority-purple)' };
                             const stripeColor = colorMap[pColor] || (pColor !== 'transparent' ? pColor : 'transparent');
                             return <div style={{ position: 'absolute', left: 0, top: '10px', bottom: '10px', width: '2.5px', borderRadius: '0 2px 2px 0', backgroundColor: stripeColor }}></div>;
                          })()}

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.45, wordBreak: 'break-word' }}>{card.title}</span>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                                {card.dueDate && (() => {
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px 6px', width: 'fit-content' }}>
                                        <Calendar size={9} />
                                        <span>{formatDueDate(card.dueDate)}</span>
                                      </div>
                                    );
                                })()}
                                {card.description && (
                                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    <AlignLeft size={14} />
                                  </div>
                                )}
                                {card.checklists && card.checklists.length > 0 && (() => {
                                    const completed = card.checklists.filter(i => i.isCompleted).length;
                                    const total = card.checklists.length;
                                    const isAllDone = completed === total && total > 0;
                                    return (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 500, color: isAllDone ? 'var(--priority-green)' : 'var(--text-muted)', background: isAllDone ? 'rgba(34,211,160,0.08)' : 'var(--surface-2)', border: isAllDone ? '1px solid rgba(34,211,160,0.2)' : '1px solid var(--border)', borderRadius: '6px', padding: '2px 6px', width: 'fit-content' }}>
                                        <CheckCircle2 size={9} />
                                        <span>{completed}/{total}</span>
                                      </div>
                                    );
                                })()}
                              </div>

                              {card.assignees && card.assignees.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  {card.assignees.map((user, idx) => {
                                    const gradients = [
                                      'linear-gradient(135deg,#4f46e5,#7c3aed)',
                                      'linear-gradient(135deg,#d97706,#f59e0b)',
                                      'linear-gradient(135deg,#059669,#10b981)',
                                      'linear-gradient(135deg,#dc2626,#f87171)',
                                      'linear-gradient(135deg,#0284c7,#38bdf8)'
                                    ];
                                    const grad = gradients[idx % gradients.length];
                                    return (
                                      <div
                                        key={user.id}
                                        style={{
                                          width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', fontWeight: 600, background: grad, border: '1.5px solid var(--bg)', marginLeft: idx > 0 ? '-6px' : '0'
                                        }}
                                        title={user.name}
                                      >
                                        {user.initials || user.name.substring(0, 2).toUpperCase()}
                                      </div>
                                    );
                                  })}
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
              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 10px 12px' }}>
                <textarea
                  autoFocus
                  value={newCardTitle}
                  onChange={(e) => setNewCardTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddCard(list.id);
                    }
                    if (e.key === 'Escape') {
                      setAddingCardToListId(null);
                      setNewCardTitle('');
                    }
                  }}
                  placeholder="Enter a title for this card..."
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', padding: '9px 11px', boxShadow: '0 0 0 3px var(--accent-dim)', resize: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '13px', minHeight: '60px', width: '100%', boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => handleAddCard(list.id)} style={{ background: 'var(--accent)', color: 'white', fontWeight: 600, borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontSize: '13px', cursor: 'pointer', border: 'none' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                    Add card
                  </button>
                  <button onClick={() => { setAddingCardToListId(null); setNewCardTitle(''); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setAddingCardToListId(list.id); setNewCardTitle(''); }}
                style={{ margin: '4px 10px 12px', background: 'none', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '8px 10px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
              >
                <Plus size={11} />
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

  const activeFiltersCount = selectedLabelFilters.length + selectedMemberFilters.length + (dueDateFilter ? 1 : 0);
  const isFiltering = Boolean(searchQuery || activeFiltersCount > 0);

  const filteredLists = useMemo(() => {
    if (!board) return [];
    
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

  const handleUpdateListTitle = async (listId: string, newTitle: string) => {
    if (!board || !newTitle.trim()) return;

    // Optimistic UI update
    setBoard({
      ...board,
      lists: board.lists.map(list => 
        list.id === listId ? { ...list, title: newTitle.trim() } : list
      )
    });

    try {
      await fetch(`http://localhost:4000/lists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
    } catch (error) {
      console.error("Failed to update list title:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>Loading...</div>;
  if (!board) return <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>No board found.</div>;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg)", fontFamily: "var(--font-body)" }}>
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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface-1)", borderBottom: "1px solid var(--border)", padding: "12px 24px", flexShrink: 0, height: "60px" }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2px' }}>Board Details</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{board.title}</h2>
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
        style={{ 
          flex: 1, display: 'flex', alignItems: 'flex-start', overflowX: 'auto', height: '100%', padding: '24px', background: 'transparent',
          ...(board.backgroundImage ? { backgroundImage: `url(${board.backgroundImage})`, backgroundSize: 'cover' } : {})
        }}
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
                    handleUpdateListTitle={handleUpdateListTitle}
                    isFiltering={isFiltering}
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
