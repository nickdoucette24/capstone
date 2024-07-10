/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("circuits").del();

  // Insert the Current F1 Circuits
  await knex("circuits").insert([
    {
      id: 2,
      circuit_short_name: "Sakhir",
      circuit_key: 63,
      track_name: "Bahrain International Circuit",
    },
    {
      id: 29,
      circuit_short_name: "Jeddah",
      circuit_key: 149,
      track_name: "Jeddah Corniche Circuit",
    },
    {
      id: 1,
      circuit_short_name: "Melbourne",
      circuit_key: 10,
      track_name: "Albert Park Circuit",
    },
    {
      id: 4,
      circuit_short_name: "Shanghai",
      circuit_key: 49,
      track_name: "Shanghai International Circuit",
    },
    {
      id: 31,
      circuit_short_name: "Miami",
      circuit_key: 151,
      track_name: "Miami International Autodrome",
    },
    {
      id: 27,
      circuit_short_name: "Imola",
      circuit_key: 6,
      track_name: "Autodromo Enzo e Dino Ferrari",
    },
    {
      id: 7,
      circuit_short_name: "Monte Carlo",
      circuit_key: 22,
      track_name: "Circuit de Monaco",
    },
    {
      id: 9,
      circuit_short_name: "Montreal",
      circuit_key: 23,
      track_name: "Circuit Gilles-Villeneuve",
    },
    {
      id: 6,
      circuit_short_name: "Catalunya",
      circuit_key: 15,
      track_name: "Circuit de Barcelona-Catalunya",
    },
    {
      id: 11,
      circuit_short_name: "Spielberg",
      circuit_key: 19,
      track_name: "Red Bull Ring",
    },
    {
      id: 12,
      circuit_short_name: "Silverstone",
      circuit_key: 2,
      track_name: "Silverstone Circuit",
    },
    {
      id: 14,
      circuit_short_name: "Hungaroring",
      circuit_key: 4,
      track_name: "Hungaroring",
    },
    {
      id: 15,
      circuit_short_name: "Spa-Francorchamps",
      circuit_key: 7,
      track_name: "Circuit de Spa-Francorchamps",
    },
    {
      id: 5,
      circuit_short_name: "Zandvoort",
      circuit_key: 55,
      track_name: "Zandvoort Circuit",
    },
    {
      id: 16,
      circuit_short_name: "Monza",
      circuit_key: 39,
      track_name: "Autodromo Nazionale Monza",
    },
    {
      id: 8,
      circuit_short_name: "Baku",
      circuit_key: 144,
      track_name: "Baku City Circuit",
    },
    {
      id: 17,
      circuit_short_name: "Singapore",
      circuit_key: 61,
      track_name: "Marina Bay Street Circuit",
    },
    {
      id: 20,
      circuit_short_name: "Austin",
      circuit_key: 9,
      track_name: "Circuit of The Americas",
    },
    {
      id: 21,
      circuit_short_name: "Mexico City",
      circuit_key: 65,
      track_name: "Autódromo Hermanos Rodríguez",
    },
    {
      id: 22,
      circuit_short_name: "Interlagos",
      circuit_key: 14,
      track_name: "Autódromo José Carlos Pace",
    },
    {
      id: 32,
      circuit_short_name: "Las Vegas",
      circuit_key: 152,
      track_name: "Las Vegas Strip Circuit",
    },
    {
      id: 30,
      circuit_short_name: "Lusail",
      circuit_key: 150,
      track_name: "Lusail International Circuit",
    },
    {
      id: 23,
      circuit_short_name: "Yas Marina Circuit",
      circuit_key: 70,
      track_name: "Yas Marina Circuit",
    },
    {
      id: 19,
      circuit_short_name: "Suzuka",
      circuit_key: 46,
      track_name: "Suzuka International Racing Course",
    },
  ]);
};
