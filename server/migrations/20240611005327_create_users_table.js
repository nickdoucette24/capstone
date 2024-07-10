/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary(); // Primary Key
    table.string("username").notNullable().unique(); // Unique Username
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").notNullable().unique(); // Unique Password
    table.string("password_hash").notNullable();
    table
      .integer("team_id")
      .unsigned()
      .references("id")
      .inTable("teams")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table
      .timestamp("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
