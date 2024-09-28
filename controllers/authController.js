const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// JWT Secret for email verification
const JWT_SECRET = "your_jwt_secret_key";

// Customer Registration
exports.register = async (req, res) => {
  try {
    //Get the registration data both admin and customer
    const reqData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role ? req.body.role : "customer", // Here use ternary for differenciate the role
    };

    //Find the user in the database
    const findUserOrAdmin = await User.findOne({
      where: { email: reqData.email },
    });

    // If same user exist so can not the forward
    if (findUserOrAdmin) {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "User Already Exist!!!",
      });
    }

    // Get the user details from the database
    const user = await User.create(reqData);

    // Generate verification token usig jwt
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send verification email
    await sendVerificationEmail(user.email, token);

    return res.status(200).json({
      status: 200,
      data: {},
      message: `${user.role} registered successfully. Please verify your email.`,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      data: {},
      error: "Something Went Wrong",
      err,
    });
  }
};

// Email verification
exports.verifyEmail = async (req, res) => {
  //get the token from the params
  const { token } = req.params;

  try {
    //use verify method for jwt to decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    //get the user details from the token
    const user = await User.findByPk(decoded.userId);

    //if token is not valid
    if (!user) {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "Invalid token",
      });
    } else {
      //set isVerified the true to identify the user verified
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        status: 200,
        data: {},
        error: "Email verified successfully",
      });
    }
  } catch (err) {
    //catch error
    return res.status(500).json({
      status: 500,
      data: {},
      error: "Something Went Wrong",
      err,
    });
  }
};

// Send verification email use nodemailer
const sendVerificationEmail = async (email, token) => {
  //set the credential for nodeMailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ranakartik461@gmail.com",
      pass: "udjl kksk vxor dtjy",
    },
  });

  //set the format for mail
  const mailOptions = {
    from: "ranakartik461@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: http://localhost:3000/verify-email/${token}`,
  };

  await transporter.sendMail(mailOptions);
};


//Customer Login
exports.customerLogin = async (req, res) => {
  try {
    // Get the Customer Login Data from Post Request
    const customerLoginData = {
      email: req.body.email,
      password: req.body.password,
    };
     //Find the data in the Database
    const findCustomer = await User.findOne({
      where: { email: customerLoginData.email },
    });

      //If data not found
    if (!findCustomer) {
      return res.status(400).json({
        status: 400,
        data: {},
        error: "Customer Not Found!!!",
      });
    }

   //Compare the password
    const isMatch = await User.findOne({
      where: { password: findCustomer.password },
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
        message: "Customer login successful",
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
