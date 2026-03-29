import { Request, Response } from "express";

import prisma from "../lib/prisma";

export const getBoards = async (_req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        lists: { orderBy: { order: "asc" } },
      },
    });

    return res.json(boards);
  } catch (error) {
    console.error("getBoards failed", error);
    return res.status(500).json({ message: "Failed to fetch boards" });
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        lists: {
          orderBy: { order: "asc" },
          include: {
            cards: {
              orderBy: { order: "asc" },
              include: { labels: true, checklists: true, assignees: true },
            },
          },
        },
      },
    });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    return res.json(board);
  } catch (error) {
    console.error("getBoardById failed", error);
    return res.status(500).json({ message: "Failed to fetch board" });
  }
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { title, backgroundImage } = req.body as {
      title?: string;
      backgroundImage?: string | null;
    };

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Title is required" });
    }

    const board = await prisma.board.create({
      data: {
        title: title.trim(),
        backgroundImage: backgroundImage ?? null,
      },
    });

    return res.status(201).json(board);
  } catch (error) {
    console.error("createBoard failed", error);
    return res.status(500).json({ message: "Failed to create board" });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, backgroundImage } = req.body as {
      title?: string;
      backgroundImage?: string | null;
    };

    const data: { title?: string; backgroundImage?: string | null } = {};

    if (typeof title === "string") {
      const trimmed = title.trim();
      if (trimmed.length === 0) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      data.title = trimmed;
    }

    if (backgroundImage !== undefined) {
      data.backgroundImage = backgroundImage;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const existing = await prisma.board.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Board not found" });
    }

    const board = await prisma.board.update({ where: { id }, data });
    return res.json(board);
  } catch (error) {
    console.error("updateBoard failed", error);
    return res.status(500).json({ message: "Failed to update board" });
  }
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.board.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Board not found" });
    }

    const deleted = await prisma.board.delete({ where: { id } });
    return res.json(deleted);
  } catch (error) {
    console.error("deleteBoard failed", error);
    return res.status(500).json({ message: "Failed to delete board" });
  }
};
