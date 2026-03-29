const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const filePath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
  console.log(`Restored: ${file}`);
};

// 2. CardModal.tsx
write('trello-clone-frontend/src/components/CardModal.tsx', `
import { useState, useEffect } from "react";
import { X, AlignLeft, CheckSquare, Tag, Type, Trash2 } from "lucide-react";
import type { Card } from "../App";

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

export const CardModal = ({ card, isOpen, onClose, onUpdateCard }: CardModalProps) => {
  const [description, setDescription] = useState(card.description || "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [labels, setLabels] = useState(card.labels || []);
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);
  const [checklists, setChecklists] = useState(card.checklists || []);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // Sync state if card changes
  useEffect(() => {
    setDescription(card.description || "");
    setLabels(card.labels || []);
    setChecklists(card.checklists || []);
  }, [card]);

  if (!isOpen) return null;

  const handleSaveDescription = async () => {
    const updatedCard = { ...card, description };
    onUpdateCard(updatedCard);
    setIsEditingDesc(false);
  };

  const handleToggleLabel = async (color: string) => {
    const existingLabel = labels.find(l => l.color === color);
    if (existingLabel) {
      // Remove
      setLabels(labels.filter(l => l.id !== existingLabel.id));
      await fetch(\`http://localhost:4000/cards/\${card.id}/labels/\${existingLabel.id}\`, { method: "DELETE" });
    } else {
      // Add
      const res = await fetch(\`http://localhost:4000/cards/\${card.id}/labels\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color })
      });
      const data = await res.json();
      setLabels(data.labels); // server should return updated card/labels
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItem.trim()) return;
    try {
      const res = await fetch(\`http://localhost:4000/cards/\${card.id}/checklists\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newChecklistItem })
      });
      const newItem = await res.json();
      setChecklists([...checklists, newItem]);
      setNewChecklistItem("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleChecklist = async (itemId: string, isCompleted: boolean) => {
    setChecklists(checklists.map(i => i.id === itemId ? { ...i, isCompleted } : i));
    await fetch(\`http://localhost:4000/checklists/\${itemId}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted })
    });
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    setChecklists(checklists.filter(i => i.id !== itemId));
    await fetch(\`http://localhost:4000/checklists/\${itemId}\`, { method: "DELETE" });
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
            {/* Labels display */}
            {labels.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Labels</h3>
                <div className="flex flex-wrap gap-2">
                  {labels.map(label => (
                    <div key={label.id} className="h-7 w-12 rounded" style={{ backgroundColor: label.color }} />
                  ))}
                </div>
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
                  className={\`rounded-lg p-3 text-sm cursor-pointer transition-colors min-h-[60px] \${description ? 'text-slate-200 hover:bg-slate-700' : 'bg-[#22272b] text-slate-400 hover:bg-slate-700/80'}\`}
                >
                  {description || "Add a more detailed description..."}
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-200">Checklist</h3>
              </div>

              {checklists.length > 0 && (
                <div className="flex items-center gap-3 w-full">
                  <span className="text-xs text-slate-400 w-8">{progressPercent}%</span>
                  <div className="h-2 flex-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={\`h-full transition-all duration-300 \${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}\`} 
                      style={{ width: \`\${progressPercent}%\` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {checklists.map(item => (
                  <div key={item.id} className="flex items-center group gap-3 hover:bg-slate-700/50 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={item.isCompleted}
                      onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span className={\`flex-1 text-sm \${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}\`}>
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
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Add to card</h3>
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
  );
};
`);

// 3. Backend Lists
write('trello-clone-backend/src/routes/lists.ts', `
import { Router } from "express";
import { createList, deleteList, getListById, getLists, updateList, reorderLists } from "../controllers/listsController";

const router = Router();
router.get("/", getLists);
router.put("/reorder", reorderLists);
router.get("/:id", getListById);
router.post("/", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

export default router;
`);

write('trello-clone-backend/src/controllers/listsController.ts', `
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getLists = async (req: Request, res: Response) => {
  try {
    const boardId = typeof req.query.boardId === "string" ? req.query.boardId : undefined;
    const lists = await prisma.list.findMany({
      where: boardId ? { boardId } : undefined,
      orderBy: { order: "asc" },
      include: { cards: { orderBy: { order: "asc" } } },
    });
    return res.json(lists);
  } catch (error) {
    console.error("getLists failed", error);
    return res.status(500).json({ message: "Failed to fetch lists" });
  }
};

export const getListById = async (req: Request, res: Response) => {
  try {
    const list = await prisma.list.findUnique({
      where: { id: req.params.id },
      include: { cards: { orderBy: { order: "asc" }, include: { labels: true, checklists: true, assignees: true } } },
    });
    if (!list) return res.status(404).json({ message: "List not found" });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch list" });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body as { title?: string; boardId?: string };
    if (!title || title.trim().length === 0 || !boardId) {
      return res.status(400).json({ message: "Title and boardId are required" });
    }
    const maxOrder = await prisma.list.aggregate({ where: { boardId }, _max: { order: true } });
    const order = (maxOrder._max.order ?? 0) + 1;
    const list = await prisma.list.create({ data: { title: title.trim(), order, boardId } });
    return res.status(201).json(list);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create list" });
  }
};

export const updateList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, order, boardId } = req.body;
    const data: any = {};
    if (typeof title === "string") {
      if (title.trim().length === 0) return res.status(400).json({ message: "Title cannot be empty" });
      data.title = title.trim();
    }
    if (typeof order === "number") data.order = order;
    if (typeof boardId === "string") data.boardId = boardId;

    const list = await prisma.list.update({ where: { id }, data });
    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update list" });
  }
};

export const reorderLists = async (req: Request, res: Response) => {
  try {
    const lists = req.body as { id: string; order: number }[];
    await prisma.$transaction(
      lists.map((list) => prisma.list.update({ where: { id: list.id }, data: { order: list.order } }))
    );
    return res.json({ message: "Lists reordered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reorder lists" });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    await prisma.list.delete({ where: { id: req.params.id } });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete list" });
  }
};
`);

// 4. Backend Cards
write('trello-clone-backend/src/routes/cards.ts', `
import { Router } from "express";
import { getCards, getCardById, createCard, updateCard, deleteCard, reorderCards, addLabelToCard, removeLabelFromCard, addChecklistItemToCard } from "../controllers/cardsController";

const router = Router();
router.get("/", getCards);
router.put("/reorder", reorderCards);
router.get("/:id", getCardById);
router.post("/", createCard);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);
router.post("/:id/labels", addLabelToCard);
router.delete("/:id/labels/:labelId", removeLabelFromCard);
router.post("/:id/checklists", addChecklistItemToCard);

export default router;
`);

write('trello-clone-backend/src/controllers/cardsController.ts', `
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getCards = async (req: Request, res: Response) => {
  try {
    const listId = typeof req.query.listId === "string" ? req.query.listId : undefined;
    const cards = await prisma.card.findMany({
      where: listId ? { listId } : undefined,
      orderBy: { order: "asc" },
      include: { labels: true, checklists: true, assignees: true },
    });
    return res.json(cards);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch cards" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const card = await prisma.card.findUnique({
      where: { id: req.params.id },
      include: { labels: true, checklists: true, assignees: true },
    });
    if (!card) return res.status(404).json({ message: "Card not found" });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch card" });
  }
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, listId } = req.body;
    if (!title || !listId) return res.status(400).json({ message: "Missing title or listId" });
    const maxOrder = await prisma.card.aggregate({ where: { listId }, _max: { order: true } });
    const order = (maxOrder._max.order ?? 0) + 1;
    const card = await prisma.card.create({
      data: { title: title.trim(), order, listId },
      include: { labels: true, checklists: true },
    });
    return res.status(201).json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create card" });
  }
};

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { title, description, order, listId, dueDate } = req.body;
    const data: any = {};
    if (title) data.title = title.trim();
    if (description !== undefined) data.description = description;
    if (order !== undefined) data.order = order;
    if (listId) data.listId = listId;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    const card = await prisma.card.update({ where: { id: req.params.id }, data });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update card" });
  }
};

export const reorderCards = async (req: Request, res: Response) => {
  try {
    const cards = req.body as { id: string; order: number; listId: string }[];
    await prisma.$transaction(
      cards.map(c => prisma.card.update({ where: { id: c.id }, data: { order: c.order, listId: c.listId } }))
    );
    return res.json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reorder" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    await prisma.card.delete({ where: { id: req.params.id } });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
};

export const addLabelToCard = async (req: Request, res: Response) => {
  try {
    const { color } = req.body;
    let label = await prisma.label.findFirst({ where: { color } });
    if (!label) label = await prisma.label.create({ data: { color } });
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: { labels: { connect: { id: label.id } } },
      include: { labels: true }
    });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add label" });
  }
};

export const removeLabelFromCard = async (req: Request, res: Response) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: { labels: { disconnect: { id: req.params.labelId } } }
    });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove label" });
  }
};

export const addChecklistItemToCard = async (req: Request, res: Response) => {
  try {
    const item = await prisma.checklistItem.create({
      data: { title: req.body.title, cardId: req.params.id, isCompleted: false }
    });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add checklist item" });
  }
};
`);

// 5. Backend Checklists 
write('trello-clone-backend/src/routes/checklists.ts', `
import { Router } from "express";
import { updateChecklistItem, deleteChecklistItem } from "../controllers/checklistsController";

const router = Router();
router.put("/:id", updateChecklistItem);
router.delete("/:id", deleteChecklistItem);

export default router;
`);

write('trello-clone-backend/src/controllers/checklistsController.ts', `
import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const updateChecklistItem = async (req: Request, res: Response) => {
  try {
    const item = await prisma.checklistItem.update({
      where: { id: req.params.id },
      data: { isCompleted: req.body.isCompleted }
    });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
};

export const deleteChecklistItem = async (req: Request, res: Response) => {
  try {
    await prisma.checklistItem.delete({ where: { id: req.params.id } });
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed" });
  }
};
`);
