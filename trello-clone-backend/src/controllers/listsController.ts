import type { Request, Response } from "express";
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
