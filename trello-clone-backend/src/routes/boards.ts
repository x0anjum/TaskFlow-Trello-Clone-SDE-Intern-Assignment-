import { Router } from "express";

import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  updateBoard,
} from "../controllers/boardsController";

const router = Router();

router.get("/", getBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
