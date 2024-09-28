const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Admin login
exports.adminLogin = async (req, res) => {
  try {
    // Get the Admin Login Data from Post Request
    const adminLoginData = {
      email: req.body.email,
      password: req.body.password,
    };

    //Find the data in the Database
    const findAdmin = await User.findOne({
      where: { email: adminLoginData.email },
    });

    //If data not found
    if (!findAdmin) {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "Admin Not Found!!!",
      });
    }

    // Check the perfmission for login in to the page
    if (findAdmin.role !== "Admin") {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "You are not allowed to login from here",
      });
    }

    //Compare the password
    const isMatch = await User.findOne({
      where: { password: findAdmin.password },
    });

    // Password does not match
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "Invalid credentials",
      });
    } else {
      //Password Match
      return res.status(200).json({
        status: 200,
        data: {},
        message: "Admin login successful",
      });
    }
  } catch (err) {
    //Generate the catch error
    return res.status(500).json({
      status: 500,
      data: {},
      error: "Something Went Wrong",
    });
  }
};
