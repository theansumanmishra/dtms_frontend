import "./index.css";
import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

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
  const navigate = useNavigate();
  const [recentDisputes, setRecentDisputes] = useState([]);
  
  useEffect(() => {
    axios
      .get("http://localhost:8080/disputes/dashboard")
      .then((res) => {
        const data = res.data;

        // ---------------- Custom Fan Pie Chart ----------------
        const pieData = Object.entries(data.subStatusCounts).map(
          ([name, count]) => ({
            name,
            y: count,
          })
        );

        Highcharts.chart("substatus-container", {
          chart: { type: "pie" },
          title: { text: "Dispute Status Breakdown" },
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
              enableMouseTracking: false,
              animation: { duration: 2000 },
              colorByPoint: true,
              data: pieData,
            },
          ],
        });

        // ---------------- Column Chart ----------------
        const periods = [
          "Today",
          "This Week",
          "This Month",
          "This Year",
          "Total",
        ];
        const counts = [
          data.timeCounts["Today"] || 0,
          data.timeCounts["This Week"] || 0,
          data.timeCounts["This Month"] || 0,
          data.timeCounts["This Year"] || 0,
          data.timeCounts["Total"] || 0,
        ];
        const barColors = [
          "#FF5733",
          "#33FF57",
          "#3357FF",
          "#FF33A8",
          "#FFC300",
        ];

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
              pointWidth: 40,
              pointPadding: 0.8,
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

    // ---- Recent Disputes Table ----
    axios
      .get("http://localhost:8080/disputes/recent")
      .then((res) => setRecentDisputes(res.data))
      .catch((err) => console.error("Error fetching recent disputes:", err));
  }, []);

  // Row click
  const handleRowClick = (id) => {
    navigate(`/disputes/${id}`);
  };

  return (
    <>
      <div
        className="container-fluid py-4 px-5 d-flex flex-column"
      >
        {/* Header */}
        <div className="mb-3">
          <h1 className="fw-bold text-primary mb-1">Dashboard</h1>
          <h5 className="text-muted">
            Manage and track banking disputes efficiently
          </h5>
        </div>

        {/* Charts Section */}
        <div className="row g-3" style={{ flex: "0 0 45%" }}>
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
              <h5 className="fw-semibold text-secondary mb-2">
                Disputes by Substatus
              </h5>
              <div id="substatus-container" style={{ height: "100%" }}></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
              <h5 className="fw-semibold text-secondary mb-2">
                Disputes Over Time
              </h5>
              <div id="timecounts-container" style={{ height: "100%" }}></div>
            </div>
          </div>
        </div>

        {/* Recent Disputes Table */}
        <div className="row g-3 mt-3">
          <div className="col-12 d-flex flex-column">
            <div className="card shadow-lg border-0 rounded-4 d-flex flex-column mb-4">
              {/* Card Header */}
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center px-3 py-2 rounded-3 mb-2">
                <h4 className="fw-bold text-primary mb-0">Recent Disputes</h4>
                <i className="bi bi-clock-history text-muted fs-4"></i>
              </div>

              {/* Table */}
              <div
                className="table-responsive flex-grow-1">
                <table className="table align-middle mb-0 rounded-3 p-4">
                  <thead className="table-light text-secondary rounded-3">
                    <tr>
                    <th>SERIAL NO</th>
                      <th className="text-uppercase px-3 py-2">Dispute ID</th>
                      <th className="text-uppercase px-3 py-2">
                        Transaction ID
                      </th>
                      <th className="text-uppercase px-3 py-2">Created Date</th>
                      <th className="text-uppercase px-3 py-2">Sub status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDisputes.map((d, index) => (
                      <tr
                        key={d.id}
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                        className="table-row-hover"
                        onClick={() => handleRowClick(d.id)}
                      >
                        <td>{index + 1}</td>
                        <td className="fw-semibold text-dark px-3 py-2">
                          DSP202500{d.id}
                        </td>
                        <td className="px-3 py-2">
                          TNX202500{d.savingsAccountTransaction?.id}
                        </td>
                        <td className="px-3 py-2 ">{d.createdDate}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`badge rounded-pill px-3 py-2 ${
                              d.status.name === "APPROVED"
                                ? "bg-success-subtle text-success"
                                : d.status.name === "REJECTED"
                                ? "bg-danger-subtle text-danger"
                                : "bg-warning-subtle text-warning"
                            }`}
                          >
                            {d.status.name.replace("_", "-")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card Footer */}
              <div className="card-footer bg-white border-0 pb-3 d-flex justify-content-end">
                <Button
                  variant="primary"
                  className="rounded-pill px-4 fw-semibold shadow-sm"
                  onClick={() => navigate("/disputes")}
                >
                  Show All Disputes <i className="bi bi-arrow-right"></i>
                </Button>
              </div>  
            </div>
          </div>
        </div>


        
      </div>
    </>
  );
};

export default View;
