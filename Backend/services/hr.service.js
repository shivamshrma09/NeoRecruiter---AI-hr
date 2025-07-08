const hrModel = require("../models/hr.model");

module.exports.createHr = async ({ companyName, email, password, Balance = 1000 }) => {
  if (!companyName || !email || !password) {
    throw new Error("All fields are required");
  }
  const hashedPassword = await hrModel.hashPassword(password);
  const user = await hrModel.create({
    companyName,
    email,
    password: hashedPassword,
    Balance
  });
  return user;
};
