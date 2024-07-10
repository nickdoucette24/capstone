/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("teams", function (table) {
    table.increments("id").primary(); // Primary Key
    table.string("team_name").notNullable();
    table.string("official_name").notNullable();
    table.string("primary_color", 7);
    table.string("secondary_color", 7);
    table.string("alternative_color", 7);
    table.string("special_color", 7);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("teams");
};
