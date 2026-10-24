import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import Menu from "../models/menuModel.js";

// Uploads local (multer temp) files to Cloudinary and returns their secure URLs.
// Always cleans up the local temp file afterwards, upload or not.
const uploadImagesToCloudinary = async (files = []) => {
  const urls = [];
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "jenz-restaurant/menu",
      });
      urls.push(result.secure_url);
    } finally {
      fs.unlink(file.path, () => {});
    }
  }
  return urls;
};

const toBool = (value, fallback) => {
  if (value === undefined) return fallback;
  return value === true || value === "true";
};

export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find({}).populate("category");
    res.json({ success: true, menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMenuById = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id).populate("category");
    if (!menu) return res.status(404).json({ success: false, message: "Menu item not found" });
    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMenu = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price and category are required" });
    }

    const images = await uploadImagesToCloudinary(req.files);

    const menu = await Menu.create({
      name,
      description,
      price,
      category,
      isVeg: toBool(req.body.isVeg, true),
      inStock: toBool(req.body.inStock, true),
      image: images,
    });

    res.json({ success: true, message: "Menu item added", menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const update = { name, description, price, category };
    if (req.body.isVeg !== undefined) update.isVeg = toBool(req.body.isVeg);
    if (req.body.inStock !== undefined) update.inStock = toBool(req.body.inStock);

    // Only replace images if new ones were uploaded; otherwise keep the
    // existing images so they don't disappear when editing other fields.
    if (req.files && req.files.length > 0) {
      update.image = await uploadImagesToCloudinary(req.files);
    }

    const menu = await Menu.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!menu) return res.status(404).json({ success: false, message: "Menu item not found" });

    res.json({ success: true, message: "Menu item updated", menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMenu = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
