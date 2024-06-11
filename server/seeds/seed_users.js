const bcrypt = require("bcrypt");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();

  // Test User Password Hash
  const hashedPassword = await bcrypt.hash("initialpassword", 10);

  await knex("users").insert([
    {
      id: 1,
      username: "pilotAccount",
      first_name: "Pilot",
      last_name: "Account",
      email: "pilot.account@placeholder.com",
      password_hash: hashedPassword,
      team_id: 3,
    },
  ]);
};
