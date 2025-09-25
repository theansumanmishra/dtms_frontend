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
      {/* CHARTS */}
      <div className="bg-light row">
        <div className="view-head">
          <h1>Dashboard</h1>
        </div>

        {/* CHARTS */}
        <div className="col-6 ms-3">
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              className="card p-3"
              id="substatus-container"
              style={{ height: "315px" }}
            ></div>
            <div
              className="card p-3"
              id="timecounts-container"
              style={{ height: "315px" }}
            ></div>
          </div>
        </div>

        {/* Recent Disputes Table */}
        <div className="col-5 card">
          <h3>Recent Disputes</h3>
          <div className="bg-light">
            <table className="table table-hover p-3 mb-0">
              <thead>
                <tr>
                  <th> Dispute ID</th>
                  <th>Transaction Id</th>
                  <th>Created Date</th>
                  <th>Substatus</th>
                </tr>
              </thead>
              <tbody>
                {recentDisputes.map((d) => (
                  <tr
                    key={`recent-dispute-${d.id}`}
                    onClick={() => handleRowClick(d.id)}
                  >
                    <td>DSP202500{d.id}</td>
                    <td>TNX202500{d.savingsAccountTransaction?.id}</td>
                    <td>{d.createdDate}</td>
                    <td>{d.status.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end mt-3 me-3">
            <Button
              variant="btn btn-outline-primary"
              className="text-decoration-none"
              onClick={() => navigate("/disputes")}
            >
              Show all disputes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
