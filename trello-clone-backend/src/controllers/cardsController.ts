import type { Request, Response } from "express";
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
export const addAssigneeToCard = async (req: Request, res: Response) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: { assignees: { connect: { id: req.body.userId } } },
      include: { assignees: true }
    });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to add assignee" });
  }
};

export const removeAssigneeFromCard = async (req: Request, res: Response) => {
  try {
    const card = await prisma.card.update({
      where: { id: req.params.id },
      data: { assignees: { disconnect: { id: req.params.userId } } },
      include: { assignees: true }
    });
    return res.json(card);
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove assignee" });
  }
};