// One-time helper script to create an admin user and the table layout
// shown in the restaurant's floor plan. Run with: node seed.js
import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import Table from "./models/tableModel.js";
import Category from "./models/categoryModel.js";

const run = async () => {
  await connectDB();

  // 1. Admin user - reads from .env so you control the real credentials
  const adminEmail = process.env.ADMIN_EMAIL || "admin@yazhirestaurant.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({ name: "Yāzhi Admin", email: adminEmail, password: hashed, role: "admin" });
    console.log(`Admin created -> email: ${adminEmail} password: ${adminPassword}`);
  } else {
    console.log(`Admin already exists (${adminEmail}), skipping`);
  }

  // 2. Tables, laid out to match the restaurant floor plan:
  //    - a bench of 8 seats along the top wall (booth style)
  //    - two rows of round 4-seat tables in the middle
  //    - a long bench of 8 seats near the entrance at the bottom
  const tables = [
    { tableNumber: "B1", capacity: 3, shape: "bench", location: "Window Booth", position: { x: 12, y: 18 } },
    { tableNumber: "B2", capacity: 3, shape: "bench", location: "Window Booth", position: { x: 35, y: 18 } },
    { tableNumber: "B3", capacity: 3, shape: "bench", location: "Window Booth", position: { x: 58, y: 10 } },

    { tableNumber: "T01", capacity: 4, shape: "round", location: "Main Hall", position: { x: 15, y: 40 } },
    { tableNumber: "T02", capacity: 4, shape: "round", location: "Main Hall", position: { x: 35, y: 40 } },
    { tableNumber: "T03", capacity: 4, shape: "round", location: "Main Hall", position: { x: 55, y: 40 } },
    { tableNumber: "T04", capacity: 4, shape: "round", location: "Main Hall", position: { x: 75, y: 40 } },

    { tableNumber: "T05", capacity: 4, shape: "round", location: "Family Area", position: { x: 25, y: 62 } },
    { tableNumber: "T06", capacity: 4, shape: "round", location: "Family Area", position: { x: 45, y: 62 } },

    { tableNumber: "B4", capacity: 8, shape: "bench", location: "Entrance Bench", position: { x: 45, y: 85 } },
  ];

  for (const t of tables) {
    const exists = await Table.findOne({ tableNumber: t.tableNumber });
    if (!exists) await Table.create(t);
  }
  console.log("Tables seeded");

  // 3. Categories
  const categories = ["Starters", "Main Course", "South Indian", "North Indian", "Chinese", "Desserts", "Beverages"];
  for (const name of categories) {
    const exists = await Category.findOne({ name });
    if (!exists) await Category.create({ name });
  }
  console.log("Categories seeded");

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
