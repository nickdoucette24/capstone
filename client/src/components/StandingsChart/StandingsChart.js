import React from "react";
import { Bar } from "react-chartjs-2";
import "./StandingsChart.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StandingsChart = ({
  labels,
  data,
  backgroundColor,
  borderColor,
  options,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Points",
        data,
        backgroundColor,
        borderColor,
        borderRadius: 2,
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} options={options} />;
};

export default StandingsChart;
