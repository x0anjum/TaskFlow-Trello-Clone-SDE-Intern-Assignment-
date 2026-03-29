import { Router } from "express";
import { updateChecklistItem, deleteChecklistItem } from "../controllers/checklistsController";

const router = Router();
router.put("/:id", updateChecklistItem);
router.delete("/:id", deleteChecklistItem);

export default router;
