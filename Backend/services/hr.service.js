const hrModel = require("../models/hr.model");

module.exports.createHr = async ({ companyName, email, password }) => {
  if (!companyName || !email || !password) {
    throw new Error("All fields are required");
  }
  
  console.log('Creating HR user:', { companyName, email });
  
  const hashedPassword = await hrModel.hashPassword(password);
  const user = await hrModel.create({
    companyName,
    email,
    password: hashedPassword,
    Balance: 1000,
    interviews: [],
    interviewCount: 0,
    interviewCountCandidate: 0
  });
  
  console.log('HR user created successfully:', user._id);
  return user;
};
