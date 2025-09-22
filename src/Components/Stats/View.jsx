import "./View.css";
import { useEffect } from "react";
import Highcharts from "highcharts";
import axios from "axios";

// ✅ Custom animation override
(function (H) {
  H.seriesTypes.pie.prototype.animate = function (init) {
    const series = this,
      chart = series.chart,
      points = series.points,
      { animation } = series.options,
      { startAngleRad } = series;

    function fanAnimate(point, startAngleRad) {
      const graphic = point.graphic,
        args = point.shapeArgs;

      if (graphic && args) {
        graphic
          .attr({
            start: startAngleRad,
            end: startAngleRad,
            opacity: 1,
          })
          .animate(
            {
              start: args.start,
              end: args.end,
            },
            {
              duration: animation.duration / points.length,
            },
            function () {
              if (points[point.index + 1]) {
                fanAnimate(points[point.index + 1], args.end);
              }
              if (point.index === series.points.length - 1) {
                series.dataLabelsGroup.animate(
                  { opacity: 1 },
                  void 0,
                  function () {
                    points.forEach((p) => {
                      p.opacity = 1;
                    });
                    series.update({ enableMouseTracking: true }, false);
                    chart.update({
                      plotOptions: {
                        pie: { innerSize: "40%", borderRadius: 8 },
                      },
                    });
                  }
                );
              }
            }
          );
      }
    }

    if (init) {
      points.forEach((p) => {
        p.opacity = 0;
      });
    } else {
      fanAnimate(points[0], startAngleRad);
    }
  };
})(Highcharts);

const View = () => {
  useEffect(() => {
    axios
      .get("http://localhost:8080/disputes/dashboard")
      .then((res) => {
        const data = res.data;
        console.log("API response:", data);

        // ---------------- Custom Fan Pie Chart ----------------
        const pieData = Object.entries(data.subStatusCounts).map(
          ([name, count]) => ({
            name,
            y: count,
          })
        );

        Highcharts.chart("substatus-container", {
          chart: { type: "pie" },
          title: { text: "Dispute SubStatus Breakdown" },
          subtitle: { text: "Custom animated pie" },
          tooltip: {
            headerFormat: "",
            pointFormat:
              '<span style="color:{point.color}">●</span> {point.name}: <b>{point.percentage:.1f}%</b>',
          },
          accessibility: {
            point: { valueSuffix: "%" },
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              borderWidth: 2,
              cursor: "pointer",
              dataLabels: {
                enabled: true,
                format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
                distance: 20,
              },
            },
          },
          series: [
            {
              enableMouseTracking: false, // disabled initially
              animation: { duration: 2000 },
              colorByPoint: true,
              data: pieData,
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
        const barColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300"];

        Highcharts.chart("timecounts-container", {
          chart: { type: "column" },
          title: { text: "Disputes Over Time" },
          xAxis: { categories: periods, title: { text: "Time Period" } },
          yAxis: {
            min: 0,
            title: { text: "Number of Disputes" },
            allowDecimals: false,
          },
          tooltip: { pointFormat: "<b>{point.y} disputes</b>" },
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true,
                style: { fontWeight: "bold" },
              },
              colorByPoint: true,
            },
          },
          series: [
            {
              name: "Disputes",
              data: counts.map((value, index) => ({
                y: value,
                color: barColors[index],
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
    <>
      {/* DISPUTE TABLES */}
      <div className="table-wrapper">
        <div className="custom-table">
          <h2 className="heading">
            All Previous Disputes <br />
            <span className="pr">
              Showing {disputes.length} of {totalDisputes} disputes
            </span>
          </h2>

          {/* Table Data */}
          <table>
            <thead className="head">
              <tr>
                <th>SERIAL NO.</th>
                <th>DISPUTE ID</th>
                <th>TRANSACTION ID</th>
                <th>DATE CREATED</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>SUB STATUS</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((row, index) => (
                <tr key={row.id} onClick={() => handleRowClick(row.id)}>
                  <td>{currentPage * rowsPerPage + index + 1}</td>
                  <td className="DSP">DSP202500{row.id}</td>
                  <td>TNX202500{row.savingsAccountTransaction?.id}</td>
                  <td>{row.createdDate}</td>
                  <td>{row.reason}</td>
                  <td>
                    <div>
                      <span
                        className={`my-badge status-${row.status.name
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {row.status.name === "INITIATED" && (
                          <i className="bi bi-hourglass-split"></i>
                        )}
                        {row.status.name === "IN-PROGRESS" && (
                          <i className="bi bi-arrow-repeat"></i>
                        )}
                        {row.status.name === "CLOSED" && (
                          <i className="bi bi-check-circle"></i>
                        )}
                        {row.status.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        className={`my-badge substatus-${row.subStatus.name
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {row.subStatus.name === "PENDING REVIEW" && (
                          <i className="bi bi-search"></i>
                        )}
                        {row.subStatus.name === "ACCEPTED" && (
                          <i className="bi bi-hand-thumbs-up"></i>
                        )}
                        {row.subStatus.name === "PARTIALLY-ACCEPTED" && (
                          <i className="bi bi-circle-half"></i>
                        )}
                        {row.subStatus.name === "REJECTED" && (
                          <i className="bi bi-x-circle"></i>
                        )}
                        {row.subStatus.name}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CHARTS */}
      <div className="bg-light">
        <div className="view-head">
          <h1>Dashboard</h1>
          <h4>Manage and track banking disputes efficiently</h4>
        </div>
        <div className="container d-flex py-4" style={{ gap: "20px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div id="substatus-container" style={{ height: "400px" }}></div>
            <div id="timecounts-container" style={{ height: "400px" }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
