import type { Request, Response } from "express";
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
