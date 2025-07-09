const hrModel = require("../models/hr.model");

module.exports.createHr = async ({ companyName, email, password }) => {
  if (!companyName || !email || !password) {
    throw new Error("All fields are required");
  }
  const hashedPassword = await hrModel.hashPassword(password);
  const user = await hrModel.create({
    companyName,
    email,
    password: hashedPassword
  });
  return user;
};
