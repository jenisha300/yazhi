import express from "express";
import { getMenus, getMenuById, addMenu, updateMenu, deleteMenu } from "../controllers/menuController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getMenus);
router.get("/:id", getMenuById);
router.post("/", protect, adminOnly, upload.array("images", 4), addMenu);
router.put("/:id", protect, adminOnly, upload.array("images", 4), updateMenu);
router.delete("/:id", protect, adminOnly, deleteMenu);

export default router;
