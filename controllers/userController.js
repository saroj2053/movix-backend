import User from "../schemas/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const Body = req.body;

  try {
    if (!Body.username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    if (Body.username.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 6 characters long.",
      });
    }

    if (!Body.password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (Body.password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (!Body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm Password is required",
      });
    }

    if (Body.password !== Body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords doesn't match",
      });
    }

    const existingUser = await User.findOne({
      username: Body.username,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists. Please login or create new account",
      });
    }

    Body.confirmPassword = undefined;

    const hashedPassword = await bcrypt.hash(Body.password, 10);

    const newUser = await User.create({
      username: Body.username,
      password: hashedPassword,
    });

    const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    newUser.password = undefined;
    return res.status(201).json({
      success: "true",
      message: "User registration successful",
      newUser,
      token: jwtToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      Body,
    });
  }
  res.send("Login route");
};

const login = async (req, res) => {
  const Body = req.body;

  if (!Body.username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  if (!Body.password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  if (Body.username.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Username must be at least 6 characters long.",
    });
  }

  if (Body.password.trim().length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  try {
    const user = await User.findOne({ username: Body.username }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).json({
        success: "false",
        message: "Invalid username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(Body.password, user.password);

    if (passwordMatch) {
      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      user.password = undefined;
      return res.status(200).json({
        success: "true",
        message: "Login Successful",
        user,
        token: jwtToken,
      });
    } else {
      return res
        .status(400)
        .json({ success: "false", message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

export { login, register };
