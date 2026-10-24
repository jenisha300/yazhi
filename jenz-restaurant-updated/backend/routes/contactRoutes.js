import express from "express";
import { submitContact, getContacts, deleteContact } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", submitContact);
router.get("/", protect, adminOnly, getContacts);
router.delete("/:id", protect, adminOnly, deleteContact);

export default router;
