const hrModel = require("../models/hr.model");
const mongoose = require('mongoose');
module.exports.createHr = async ({ companyName, email, password }) => {
  if (!companyName || !email || !password) {
    throw new Error("All fields are required");
  }
  console.log('🔄 Creating HR user:', { companyName, email });
  try {
    const hashedPassword = await hrModel.hashPassword(password);
    console.log('✅ Password hashed successfully');
    const user = await hrModel.create({
      companyName,
      email,
      password: hashedPassword,
      Balance: 1000,
      interviews: [],
      interviewCount: 0,
      interviewCountCandidate: 0
    });
    console.log('✅ HR user created successfully:', user._id);
    return user;
  } catch (error) {
    console.error('❌ Error creating HR user:', error.message);
    throw error;
  }
};
