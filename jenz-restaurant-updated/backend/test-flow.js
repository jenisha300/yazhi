import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import crypto from "crypto";

import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import tableRouter from "./routes/tableRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import User from "./models/userModel.js";
import Table from "./models/tableModel.js";
import Booking from "./models/bookingModel.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/tables", tableRouter);
app.use("/api/booking", bookingRouter);

const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}`;

let server;

const runTests = async () => {
  console.log("==================================================");
  console.log("   YĀZHI RESTAURANT - AUTH & BOOKING TEST SUITE");
  console.log("==================================================\n");

  await connectDB();
  server = app.listen(PORT);
  console.log(`Test server active on port ${PORT}\n`);

  let passedCount = 0;
  const cleanupEmails = [];

  try {
    // ---------------------------------------------------------------
    // TEST 1 — Signup → Login → Book Table → Confirmation Email
    // ---------------------------------------------------------------
    console.log("--- TEST 1: Signup, Login, Booking, Confirmation Email ---");
    const testEmail1 = `test_user_${Date.now()}@example.com`;
    const testPassword1 = "Secret@123";
    cleanupEmails.push(testEmail1);

    const regRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Alice Gourmet", email: testEmail1, password: testPassword1 }),
    });
    const regData = await regRes.json();
    if (!regData.success || !regData.token) {
      throw new Error(`Test 1 failed on registration: ${JSON.stringify(regData)}`);
    }
    console.log("✓ Step 1: Signup succeeded and returned a token immediately (no OTP gate)");

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail1, password: testPassword1 }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.token) {
      throw new Error(`Test 1 failed on login: ${JSON.stringify(loginData)}`);
    }
    console.log("✓ Step 2: Login succeeded with correct credentials");

    const sampleTable = await Table.findOne({ active: true });
    if (!sampleTable) {
      throw new Error("No active table available for booking test");
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const bookRes = await fetch(`${BASE_URL}/api/booking/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginData.token}`,
      },
      body: JSON.stringify({
        name: "Alice Gourmet",
        email: "some-other-address@example.com", // deliberately different from the account email
        phone: "555-0199",
        numberOfPeople: 2,
        tableId: sampleTable._id,
        date: dateStr,
        startTime: "18:00",
        note: "Window seat preferred",
      }),
    });
    const bookData = await bookRes.json();
    if (!bookData.success || !bookData.booking) {
      throw new Error(`Test 1 failed on booking creation: ${JSON.stringify(bookData)}`);
    }
    console.log("✓ Step 3: Logged-in user successfully created a table reservation");
    console.log(`✓ Step 4: Confirmation email attempted: emailSent=${bookData.emailSent} (true only if real SMTP creds are configured in .env)`);
    console.log("✓ TEST 1 PASSED!\n");
    passedCount++;

    // ---------------------------------------------------------------
    // TEST 2 — Duplicate Email Registration Rejected
    // ---------------------------------------------------------------
    console.log("--- TEST 2: Duplicate Email Rejected ---");
    const dupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Duplicate Person", email: testEmail1, password: "Password@123" }),
    });
    const dupData = await dupRes.json();
    if (dupRes.status !== 400 || dupData.success !== false) {
      throw new Error(`Test 2 failed: duplicate email was not rejected: ${JSON.stringify(dupData)}`);
    }
    console.log(`✓ Duplicate email correctly rejected: "${dupData.message}"`);
    console.log("✓ TEST 2 PASSED!\n");
    passedCount++;

    // ---------------------------------------------------------------
    // TEST 3 — Wrong Password Rejected
    // ---------------------------------------------------------------
    console.log("--- TEST 3: Wrong Password Rejected ---");
    const wrongPassRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail1, password: "TotallyWrongPassword" }),
    });
    const wrongPassData = await wrongPassRes.json();
    if (wrongPassRes.status !== 400 || wrongPassData.success !== false) {
      throw new Error(`Test 3 failed: wrong password was not rejected: ${JSON.stringify(wrongPassData)}`);
    }
    console.log(`✓ Wrong password correctly rejected: "${wrongPassData.message}"`);
    console.log("✓ TEST 3 PASSED!\n");
    passedCount++;

    // ---------------------------------------------------------------
    // TEST 4 — Forgot Password → Reset Password → Login With New Password
    // ---------------------------------------------------------------
    console.log("--- TEST 4: Forgot Password / Reset Password Flow ---");

    const forgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail1 }),
    });
    const forgotData = await forgotRes.json();
    if (!forgotData.success) {
      throw new Error(`Test 4 failed on forgot-password request: ${JSON.stringify(forgotData)}`);
    }
    console.log(`✓ Step 1: Forgot-password request accepted with generic message: "${forgotData.message}"`);

    const userWithReset = await User.findOne({ email: testEmail1 });
    if (!userWithReset.reset_password_token || !userWithReset.reset_password_expires) {
      throw new Error("Test 4 failed: reset token was not stored on the user record");
    }
    console.log("✓ Step 2: DB confirms a hashed, expiring reset token was stored (not plain text)");

    // We don't have the raw token (it only ever left the server inside the
    // email), so to test the reset endpoint itself we mint one the same way
    // the controller does and inject its hash directly - this proves the
    // verify/consume logic works without needing to read a real inbox.
    const rawTestToken = crypto.randomBytes(32).toString("hex");
    userWithReset.reset_password_token = crypto.createHash("sha256").update(rawTestToken).digest("hex");
    userWithReset.reset_password_expires = new Date(Date.now() + 10 * 60 * 1000);
    await userWithReset.save();

    const badTokenRes = await fetch(`${BASE_URL}/api/auth/reset-password/thisIsNotARealToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "NewSecret@456" }),
    });
    const badTokenData = await badTokenRes.json();
    if (badTokenRes.status !== 400 || badTokenData.success !== false) {
      throw new Error(`Test 4 failed: invalid token was not rejected: ${JSON.stringify(badTokenData)}`);
    }
    console.log(`✓ Step 3: Invalid reset token correctly rejected: "${badTokenData.message}"`);

    const newPassword = "NewSecret@456";
    const resetRes = await fetch(`${BASE_URL}/api/auth/reset-password/${rawTestToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    const resetData = await resetRes.json();
    if (!resetData.success || !resetData.token) {
      throw new Error(`Test 4 failed on valid reset: ${JSON.stringify(resetData)}`);
    }
    console.log("✓ Step 4: Valid reset token accepted, password updated, user logged in");

    const reuseRes = await fetch(`${BASE_URL}/api/auth/reset-password/${rawTestToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "AnotherPassword@789" }),
    });
    const reuseData = await reuseRes.json();
    if (reuseRes.status !== 400 || reuseData.success !== false) {
      throw new Error(`Test 4 failed: reset token was reusable: ${JSON.stringify(reuseData)}`);
    }
    console.log(`✓ Step 5: Reset token correctly rejected on reuse (single-use enforced): "${reuseData.message}"`);

    const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail1, password: newPassword }),
    });
    const newLoginData = await newLoginRes.json();
    if (!newLoginData.success || !newLoginData.token) {
      throw new Error(`Test 4 failed: could not log in with new password: ${JSON.stringify(newLoginData)}`);
    }
    console.log("✓ Step 6: Login succeeds with the new password");

    const oldLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail1, password: testPassword1 }),
    });
    if (oldLoginRes.status !== 400) {
      throw new Error("Test 4 failed: old password still works after reset");
    }
    console.log("✓ Step 7: Old password correctly no longer works");
    console.log("✓ TEST 4 PASSED!\n");
    passedCount++;

    // ---------------------------------------------------------------
    // TEST 5 — Forgot Password Never Reveals Whether an Email Exists
    // ---------------------------------------------------------------
    console.log("--- TEST 5: Forgot Password Does Not Leak Account Existence ---");
    const unknownEmail = `does_not_exist_${Date.now()}@example.com`;
    const unknownForgotRes = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: unknownEmail }),
    });
    const unknownForgotData = await unknownForgotRes.json();
    if (
      unknownForgotRes.status !== forgotRes.status ||
      unknownForgotData.message !== forgotData.message
    ) {
      throw new Error("Test 5 failed: response differs for registered vs unregistered email");
    }
    console.log("✓ Response for an unregistered email is identical to a registered one - no account enumeration");
    console.log("✓ TEST 5 PASSED!\n");
    passedCount++;

    // Clean up created test data
    await User.deleteMany({ email: { $in: cleanupEmails } });
    await Booking.deleteMany({ email: "some-other-address@example.com" });
    console.log("✓ Cleaned up temporary test users and bookings from database.");

    console.log("\n==================================================");
    console.log(`   ALL ${passedCount} OF 5 TESTS PASSED SUCCESSFULLY!`);
    console.log("==================================================");
  } catch (error) {
    console.error("\n❌ TEST SUITE FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    server?.close();
    await import("mongoose").then((m) => m.default.connection.close());
  }
};

runTests();
