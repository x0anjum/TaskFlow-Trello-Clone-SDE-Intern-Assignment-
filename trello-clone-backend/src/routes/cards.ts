import { Router } from "express";
import { getCards, getCardById, createCard, updateCard, deleteCard, reorderCards, addLabelToCard, removeLabelFromCard, addChecklistItemToCard, addAssigneeToCard, removeAssigneeFromCard } from "../controllers/cardsController";

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
router.post("/:id/assignees", addAssigneeToCard);
router.delete("/:id/assignees/:userId", removeAssigneeFromCard);

export default router;
