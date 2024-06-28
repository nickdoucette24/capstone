const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// JWT configuration
const { JWT_SECRET, JWT_LONG_EXPIRY, JWT_SHORT_EXPIRY } = process.env;

// Registration Configuration
router.post("/register", async (req, res) => {
  // List all required properties
  const requiredProperties = [
    "username",
    "first_name",
    "last_name",
    "email",
    "password",
    "team_id",
  ];

  const { username, email, password, first_name, last_name, team_id } =
    req.body;

  // Check if all required properties are present
  for (const property of requiredProperties) {
    if (!req.body[property]) {
      return res.status(400).json({
        message: `Missing data in registration payload: ${property}`,
      });
    }
  }

  try {
    // Check if username or email is already in the system
    const existingUser = await knex("users")
      .where({ username })
      .orWhere({ email })
      .first();

    if (existingUser) {
      return res.status(400).json({
        message: "Username or Email already in use",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await knex("users").insert({
      username,
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      team_id,
    });

    // Generate the JWT for the user
    const token = jwt.sign(
      {
        username,
        email,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_LONG_EXPIRY,
      }
    );

    // Return the token along with the success message
    return res.status(201).json({
      message: "Registration Successful!",
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Unable to Register User: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

// Login Configuration
router.post("/login", async (req, res) => {
  // Check if password and either the email or username are in the request body
  const { identifier, password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Missing password in login payload",
    });
  } else if (!identifier) {
    return res.status(400).json({
      message: "Missing email or username in login payload",
    });
  }

  try {
    // Check if the user is already registered
    const user = await knex("users")
      .where({ email: identifier })
      .orWhere({ username: identifier })
      .first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or username",
      });
    }

    //   Compare the password against the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Generate the JWT for the user
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: JWT_SHORT_EXPIRY,
      }
    );

    // Send a token with the success message
    return res.status(200).json({
      message: "Login Successful",
      id: user.id,
      token: token,
    });
  } catch (error) {
    console.error("Unable to Login: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
