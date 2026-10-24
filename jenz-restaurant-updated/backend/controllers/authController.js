import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { sendPasswordResetEmail } from "../utils/emailService.js";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RESET_TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Account created successfully!",
      user: publicUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Logged in successfully",
      user: publicUser(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    // clearCookie no longer accepts maxAge (deprecated in Express 4, removed in v5) -
    // pass everything except maxAge, so it must still match the flags used in res.cookie().
    const { maxAge, ...clearOptions } = cookieOptions;
    res.clearCookie("token", clearOptions);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  try {
    res.json({ success: true, user: { ...publicUser(req.user), _id: req.user._id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/forgot-password
// Always responds with the same generic message whether or not the email
// exists, so this endpoint can't be used to discover which emails have accounts.
export const forgotPassword = async (req, res) => {
  const genericMessage = "If that email is registered, a password reset link has been sent.";
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
      // Raw token goes in the email link; only its hash is stored in the DB,
      // so a database leak alone can never be used to reset a password.
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

      user.reset_password_token = hashedToken;
      user.reset_password_expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MS);
      await user.save();

      const resetLink = `${(process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "")}/reset-password/${rawToken}`;

      try {
        await sendPasswordResetEmail({ user, resetLink });
      } catch (err) {
        console.error("[AuthController] Password reset email failed:", err.message);
        // Still return the generic success message - don't leak delivery status.
      }
    }

    res.json({ success: true, message: genericMessage });
  } catch (error) {
    // Even on unexpected errors, don't leak whether the email exists.
    console.error("[AuthController] forgotPassword error:", error.message);
    res.json({ success: true, message: genericMessage });
  }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      reset_password_token: hashedToken,
      reset_password_expires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This password reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    // Single-use: clear the token immediately so it can never be reused.
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    const jwtToken = generateToken(user._id);
    res.cookie("token", jwtToken, cookieOptions);

    res.json({
      success: true,
      message: "Your password has been reset successfully. You're now logged in.",
      user: publicUser(user),
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};