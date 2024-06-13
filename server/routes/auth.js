const express = require("express");
const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");

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

  // Check if all required properties are present
  for (const property of requiredProperties) {
    if (!req.body[property]) {
      return res.status(400).json({
        message: `Missing data in registration payload: ${property}`,
      });
    }
  }

  // Hash the password

  try {
  } catch (error) {
    console.error("Unable to Register: ", error);
  }
});
