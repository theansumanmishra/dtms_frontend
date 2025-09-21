import { useEffect } from "react";
import Highcharts from "highcharts";
import axios from "axios";

const View = () => {
  useEffect(() => {
    axios
      .get("http://localhost:8080/disputes/dashboard")
      .then((res) => {
        const data = res.data;
        console.log("API response:", data);

        // ---------------- Pie Chart ----------------
        const subStatusData = Object.entries(data.subStatusCounts).map(
          ([name, count]) => ({ name, y: count })
        );

        Highcharts.chart("substatus-container", {
          chart: {
            type: "pie",
            zooming: { type: "xy" },
            panning: { enabled: true, type: "xy" },
            panKey: "shift",
          },
          title: { text: "Dispute Status Breakdown" },
          tooltip: { valueSuffix: " disputes" },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: "pointer",
              dataLabels: [
                { enabled: true, distance: 20 },
                {
                  enabled: true,
                  distance: -40,
                  format: "{point.percentage:.1f}%",
                  style: { fontSize: "1.2em", textOutline: "none", opacity: 0.7 },
                  filter: { operator: ">", property: "percentage", value: 10 },
                },
              ],
            },
          },
          series: [
            {
              name: "Count",
              colorByPoint: true,
              data: subStatusData,
            },
          ],
        });

// ---------------- Column Chart ----------------
const periods = ["Today", "This Week", "This Month", "This Year", "Total"];
const counts = [
  data.timeCounts["Today"] || 0,
  data.timeCounts["This Week"] || 0,
  data.timeCounts["This Month"] || 0,
  data.timeCounts["This Year"] || 0,
  data.timeCounts["Total"] || 0,
];

// Assign a unique color to each bar
const barColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300"];

Highcharts.chart("timecounts-container", {
  chart: { type: "column" },
  title: { text: "Disputes Over Time" },
  xAxis: {
    categories: periods,
    title: { text: "Time Period" },
  },
  yAxis: {
    min: 0,
    title: { text: "Number of Disputes" },
    allowDecimals: false,
  },
  tooltip: {
    pointFormat: "<b>{point.y} disputes</b>",
  },
  plotOptions: {
    column: {
      dataLabels: { enabled: true, style: { fontWeight: "bold" } },
      colorByPoint: true, // allows each point to use its color
    },
  },
  series: [
    {
      name: "Disputes",
      data: counts.map((value, index) => ({
        y: value,
        color: barColors[index], // assign color to each bar
      })),
    },
  ],
});


      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
      });
  }, []);

  return (
    <div>
      {/* Pie Chart */}
      <div
        id="substatus-container"
        style={{ height: "400px", marginBottom: "50px" }}
      ></div>

      {/* Column Chart */}
      <div id="timecounts-container" style={{ height: "400px" }}></div>
    </div>
  );
};

export default View;
