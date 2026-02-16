const Admin = require("../models/Admin");

const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@gmail.com" });

    if (!existingAdmin) {
      await Admin.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: "Admin@123",   // First time login password
        role: "admin"
      });

      console.log("Default Admin Created");
    } else {
      console.log("Admin already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

module.exports = createDefaultAdmin;
