require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash("password123", 10);
  const users = [
    { name: "Admin", email: "admin@traffic.com", role: "admin" },
    { name: "Reviewer One", email: "reviewer@traffic.com", role: "reviewer" },
    { name: "Officer One", email: "officer@traffic.com", role: "officer" },
    { name: "Citizen One", email: "citizen@traffic.com", role: "citizen" },
  ];
  for (const u of users) {
    await User.updateOne({ email: u.email }, { $setOnInsert: { ...u, password: hash } }, { upsert: true });
  }
  console.log("Seeded demo users (password: password123)");
  process.exit(0);
})();
