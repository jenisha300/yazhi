import express from "express";
import {
  getAllTables,
  getAvailableTables,
  addTable,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTables);
router.get("/available", getAvailableTables);
router.post("/", protect, adminOnly, addTable);
router.put("/:id", protect, adminOnly, updateTable);
router.delete("/:id", protect, adminOnly, deleteTable);

export default router;
