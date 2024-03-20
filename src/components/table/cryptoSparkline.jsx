import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const CryptoSparkline = ({ crypto }) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null); // To keep track of the chart instance

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas && crypto) {
      // If there's an existing chart instance, destroy it before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = canvas.getContext("2d");
      const data = Object.values(crypto.sparkline_in_7d.price).map((price) =>
        parseFloat(price)
      );

      // Create a new chart instance and assign it to the ref
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: 168 }, (_, i) => i + 1),
          datasets: [
            {
              data: data, // Example data
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
              pointRadius: 0,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              display: false, // Hides legend
            },
            tooltip: {
              enabled: false,
            },
          },
          scales: {
            x: {
              display: false, // Hides X-axis
              beginAtZero: false,
            },
            y: {
              display: false, // Hides Y-axis
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              borderWidth: 1, // Adjust line thickness
            },
            point: {
              radius: 0,
            },
          },
          hover: {
            // mode: null, // This disables hover effects
          },
          maintainAspectRatio: false,
        },
      });
    }

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [crypto]); // Depend on crypto prop

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} width="100" height="50"></canvas>
    </div>
  );
};

export default CryptoSparkline;
