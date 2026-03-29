import { useState, useEffect } from "react";
import { X, AlignLeft, CheckSquare, Tag, Type, Trash2, Users } from "lucide-react";
import type { Card } from "../App";
import type { User } from "../App";

interface CardModalProps {
  card: Card;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCard: (card: Card) => void;
}

const AVAILABLE_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899"
];

const CardModal = ({ card, isOpen, onClose, onUpdateCard }: CardModalProps) => {
  const [description, setDescription] = useState(card.description || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [labels, setLabels] = useState(card.labels || []);
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);
  const [checklists, setChecklists] = useState(card.checklists || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<string>(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : "");
  
  const [assignees, setAssignees] = useState<User[]>(card.assignees || []);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Sync state if card changes
  useEffect(() => {
    setDescription(card.description || "");
    setLabels(card.labels || []);
    setChecklists(card.checklists || []);
    setDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : "");
    setAssignees(card.assignees || []);
  }, [card]);

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_API_URL}/users`)
        .then(res => res.json())
        .then(data => setAllUsers(data))
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDueDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDueDate(newDate);
    
    // Format to ISO string or pass null to server
    const dateValue = newDate ? new Date(newDate).toISOString() : null;
    const updatedCard = { ...card, dueDate: dateValue as string | undefined };
    
    // Pass it up to update the main UI state
    onUpdateCard(updatedCard);
    
    // Send the update to the Express server
    await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dueDate: dateValue })
    });
  };

  const handleSaveDescription = async () => {
    const updatedCard = { ...card, description };
    onUpdateCard(updatedCard);
    setIsEditingDesc(false);
  };

  const handleToggleLabel = async (color: string) => {
    const existingLabel = labels.find(l => l.color === color);
    let newLabels;
    if (existingLabel) {
      // Remove
      newLabels = labels.filter(l => l.id !== existingLabel.id);
      setLabels(newLabels);
      await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}/labels/${existingLabel.id}`, { method: "DELETE" });
    } else {
      // Add
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}/labels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color })
      });
      const data = await res.json();
      newLabels = data.labels;
      setLabels(newLabels); // server should return updated card/labels       
    }
    
    onUpdateCard({ ...card, labels: newLabels });
  };

  const handleToggleMember = async (user: User) => {
    const isAssigned = assignees.some(a => a.id === user.id);
    let newAssignees;
    if (isAssigned) {
      newAssignees = assignees.filter(a => a.id !== user.id);
      setAssignees(newAssignees);
      await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}/assignees/${user.id}`, { method: "DELETE" });
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}/assignees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      newAssignees = data.assignees;
      setAssignees(newAssignees);
    }
    
    onUpdateCard({ ...card, assignees: newAssignees });
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cards/${card.id}/checklists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChecklistItem })
      });
      const newItem = await res.json();
      const newChecklists = [...checklists, newItem];
      setChecklists(newChecklists);
      setNewChecklistItem("");
      onUpdateCard({ ...card, checklists: newChecklists });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleChecklist = async (itemId: string, isCompleted: boolean) => {
    const newChecklists = checklists.map(i => i.id === itemId ? { ...i, isCompleted } : i);
    setChecklists(newChecklists);
    onUpdateCard({ ...card, checklists: newChecklists });
    await fetch(`${import.meta.env.VITE_API_URL}/checklists/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted })
    });
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    const newChecklists = checklists.filter(i => i.id !== itemId);
    setChecklists(newChecklists);
    onUpdateCard({ ...card, checklists: newChecklists });
    await fetch(`${import.meta.env.VITE_API_URL}/checklists/${itemId}`, { method: "DELETE" });
  };

  const completedCount = checklists.filter(i => i.isCompleted).length;
  const progressPercent = checklists.length === 0 ? 0 : Math.round((completedCount / checklists.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-[#323940] rounded-xl shadow-2xl flex flex-col max-h-screen">
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-slate-400" />
            <h2 className="text-xl font-semibold text-slate-200">{card.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-8">
            {/* Meta info row (Members & Labels) */}
            {(assignees.length > 0 || labels.length > 0) && (
              <div className="flex flex-wrap gap-6">
                {/* Members display */}
                {assignees.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Members</h3>
                    <div className="flex flex-wrap gap-1">
                      {assignees.map(user => (
                        <div 
                          key={user.id} 
                          className="h-8 w-8 rounded-full flex items-center justify-center text-xs text-white font-medium"
                          style={{ backgroundColor: user.color || '#3b82f6' }}
                          title={user.name}
                        >
                          {user.initials || user.name.substring(0, 2).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labels display */}
                {labels.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {labels.map(label => (
                        <div key={label.id} className="h-8 w-12 rounded" style={{ backgroundColor: label.color }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <AlignLeft className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-200">Description</h3>
              </div>
              
              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[120px] rounded-lg bg-[#22272b] p-3 text-sm text-[#C7D1DB] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Add a more detailed description..."
                  />
                  <div className="flex items-center gap-2">
                    <button onClick={handleSaveDescription} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                      Save
                    </button>
                    <button onClick={() => { setIsEditingDesc(false); setDescription(card.description || ""); }} className="hover:bg-slate-700 text-slate-300 px-4 py-2 rounded text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingDesc(true)}
                  className={`rounded-lg p-3 text-sm cursor-pointer transition-colors min-h-[60px] ${description ? 'text-slate-200 hover:bg-slate-700' : 'bg-[#22272b] text-slate-400 hover:bg-slate-700/80'}`}
                >
                  {description || "Add a more detailed description..."}
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-slate-400" />
                  <h3 className="text-lg font-semibold text-slate-200">Checklist</h3>
                </div>
                {checklists.length > 0 && (
                  <button
                    onClick={() => setHideCompleted(!hideCompleted)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition-colors font-medium"
                  >
                    {hideCompleted ? "Show checked items" : "Hide completed items"}
                  </button>
                )}
              </div>

              {checklists.length > 0 && (
                <div className="flex items-center gap-3 w-full">
                  <span className="text-xs text-slate-400 w-8">{progressPercent}%</span>
                  <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${progressPercent === 100 ? 'bg-[#61bd4f]' : 'bg-blue-500'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {checklists.filter(item => hideCompleted ? !item.isCompleted : true).map(item => (
                  <div key={item.id} className="flex items-center group gap-3 hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span className={`flex-1 text-sm ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {item.title}
                    </span>
                    <button 
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                  placeholder="Add an item..."
                  className="w-full rounded bg-[#22272b] p-2.5 text-sm text-[#C7D1DB] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Sidebar / Tools */}
          <div className="w-full md:w-48 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Due Date</h3>
              <div className="flex items-center gap-2 bg-[#282e33] p-2 rounded text-sm text-slate-300">
                <input
                  type="date"
                  value={dueDate}
                  onChange={handleDueDateChange}
                  className="bg-transparent text-slate-200 outline-none w-full color-scheme-dark"
                  style={{ colorScheme: 'dark' }}
                />
                {dueDate && (
                  <button onClick={() => handleDueDateChange({ target: { value: "" } } as any)} className="text-slate-400 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest pt-2">Add to card</h3>
            <div className="space-y-2">
              <div className="relative">
                <button
                  onClick={() => setIsMembersOpen(!isMembersOpen)}
                  className="w-full flex items-center gap-2 bg-[#22272b] hover:bg-slate-700 text-slate-200 px-3 py-2 rounded text-sm transition-colors"
                >
                  <Users className="h-4 w-4" />
                  Members
                </button>

                {isMembersOpen && (
                  <div className="absolute top-11 left-0 w-64 bg-[#282e33] rounded-lg shadow-xl border border-slate-700 p-3 z-10">
                    <h4 className="text-xs font-semibold text-slate-400 text-center mb-3">Members</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allUsers.map((user) => {
                        const isAssigned = assignees.some(a => a.id === user.id);
                        return (
                          <button
                            key={user.id}
                            onClick={() => handleToggleMember(user)}
                            className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors text-left"
                          >
                            <div 
                              className="h-6 w-6 rounded-full flex shrink-0 items-center justify-center text-[10px] text-white font-medium"
                              style={{ backgroundColor: user.color || '#3b82f6' }}
                            >
                              {user.initials || user.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="flex-1 text-sm text-slate-200 truncate">{user.name}</span>
                            {isAssigned && <span className="text-blue-500 text-sm">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsLabelsOpen(!isLabelsOpen)}
                  className="w-full flex items-center gap-2 bg-[#22272b] hover:bg-slate-700 text-slate-200 px-3 py-2 rounded text-sm transition-colors"
                >
                  <Tag className="h-4 w-4" />
                  Labels
                </button>
              {isLabelsOpen && (
                <div className="absolute top-11 left-0 w-64 bg-[#282e33] rounded-lg shadow-xl border border-slate-700 p-3 z-10">
                  <h4 className="text-xs font-semibold text-slate-400 text-center mb-3">Labels</h4>
                  <div className="space-y-2">
                    {AVAILABLE_COLORS.map((color) => {
                      const isActive = labels.some(l => l.color === color);
                      return (
                        <button
                          key={color}
                          onClick={() => handleToggleLabel(color)}
                          className="w-full h-8 rounded relative overflow-hidden flex items-center px-2 hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: color }}
                        >
                          {isActive && <div className="absolute right-2 text-white/90 font-bold">✓</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
