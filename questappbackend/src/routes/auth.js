const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const NotFoundError = require("../errors/not-found");
const BadRequestError = require("../errors/bad-request");
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) throw BadRequestError("User already exists");

  const user = await User.create({ name, email, password });
  res.status(201).json({
    message: "User registered successfully",
    token: user.createJWT(),
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password!");
  }

  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("User not found");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new BadRequestError("Invalid credentials");
  const token = user.createJWT();
  res.status(200).json({ token });
});

module.exports = router;
