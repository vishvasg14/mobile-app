const mongoose = require("mongoose");
const { connectDB } = require("../src/config");
const User = require("../src/models/User");
const { hashPassword } = require("../src/utils/password");
const ROLES = require("../src/constants/roles");

const ADMIN = {
  name: "Admin",
  email: "Admin123@gmail.com",
  password: "Admin@123"
};

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ email: ADMIN.email }).select("+password");
  const hashed = await hashPassword(ADMIN.password);

  if (existing) {
    existing.name = ADMIN.name;
    existing.email = ADMIN.email;
    existing.password = hashed;
    existing.role = ROLES.ADMIN;
    await existing.save();
    console.log("Admin user updated:", existing.email);
  } else {
    await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      password: hashed,
      role: ROLES.ADMIN
    });
    console.log("Admin user created:", ADMIN.email);
  }

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error("Admin seed failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
