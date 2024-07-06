/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("circuits", function (table) {
    table.increments("id").primary(); // Primary Key
    table.integer("circuit_key").notNullable();
    table.string("track_name").notNullable();
    table.string("circuit_short_name").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("circuits");
};
