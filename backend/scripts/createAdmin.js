const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password || password.length < 12) {
      throw new Error("Provide an admin email and a password of at least 12 characters");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      throw new Error("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "ADMIN"
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();