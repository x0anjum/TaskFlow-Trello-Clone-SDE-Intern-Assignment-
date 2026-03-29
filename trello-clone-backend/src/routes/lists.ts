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
