/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("teams").del();
  await knex("teams").insert([
    {
      id: 1,
      team_name: "Alpine",
      official_name: "BWT Alpine F1 Team",
      primary_color: "#000000",
      secondary_color: "#F363B9",
      alternative_color: "#FFFFFF",
      special_color: "#005CAA",
    },
    {
      id: 2,
      team_name: "Aston Martin",
      official_name: "Aston Martin Aramco F1 Team",
      primary_color: "#05423D",
      secondary_color: "#00655E",
      alternative_color: "#FFFFFF",
      special_color: "#CEDC01",
    },
    {
      id: 3,
      team_name: "Ferrari",
      official_name: "Scuderia Ferrari",
      primary_color: "#E11D20",
      secondary_color: "#000000",
      alternative_color: "#FFFFFF",
      special_color: "#FFF200",
    },
    {
      id: 4,
      team_name: "Haas",
      official_name: "MoneyGram Haas F1 Team",
      primary_color: "#FFFFFF",
      secondary_color: "#D9291C",
      alternative_color: "#000000",
      special_color: "#191B1F",
    },
    {
      id: 5,
      team_name: "Kick Sauber",
      official_name: "Stake F1 Team Kick Sauber",
      primary_color: "#00E701",
      secondary_color: "#0B0E0F",
      alternative_color: "#FFFFFF",
      special_color: "#474F54",
    },
    {
      id: 6,
      team_name: "McLaren",
      official_name: "McLaren Formula 1 Team",
      primary_color: "#FF8001",
      secondary_color: "#000000",
      alternative_color: "#FFFFFF",
      special_color: "#5AD3FE",
    },
    {
      id: 7,
      team_name: "Mercedes",
      official_name: "Mercedes-AMG PETRONAS F1 Team",
      primary_color: "#000000",
      secondary_color: "#C8CCCE",
      alternative_color: "#00F5D0",
      special_color: "#FFFFFF",
    },
    {
      id: 8,
      team_name: "RB",
      official_name: "Visa Cash App RB Forumla One Team",
      primary_color: "#1434CB",
      secondary_color: "#FFFFFF",
      alternative_color: "#FF0000",
      special_color: "#09B03B",
    },
    {
      id: 9,
      team_name: "Red Bull",
      official_name: "Oracle Red Bull Racing",
      primary_color: "#001A30",
      secondary_color: "#DB0940",
      alternative_color: "#FFFFFF",
      special_color: "#FCD603",
    },
    {
      id: 10,
      team_name: "Williams",
      official_name: "Williams Racing",
      primary_color: "#001396",
      secondary_color: "#FDFDFE",
      alternative_color: "#E40145",
      special_color: "#00A0DE",
    },
  ]);
};
