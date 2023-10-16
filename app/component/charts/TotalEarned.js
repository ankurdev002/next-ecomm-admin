/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import dynamic from "next/dynamic";
import { ContextData } from "../context/Context.";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function TotalEarned() {
  const { sun, mode } = useContext(ContextData);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    await axios.get("/api/orders").then((res) => setSales(res.data));
  }

  const calculateYearlyTotalEarned = () => {
    const yearlyTotalEarned = {};

    // Iterate through sales data and extract year and sales amount
    sales.forEach((sale) => {
      const year = new Date(sale.createdAt).getFullYear();
      const salesAmount = sale.line_items.reduce(
        (total, item) =>
          total + (item.price_data.unit_amount * item.quantity) / 100,
        0
      );

      // Update the yearly total earned
      if (year in yearlyTotalEarned) {
        yearlyTotalEarned[year] += salesAmount;
      } else {
        yearlyTotalEarned[year] = salesAmount;
      }
    });

    // Convert the data to the format expected by ApexCharts
    return Object.keys(yearlyTotalEarned).map((year) => ({
      x: year,
      y: [0, yearlyTotalEarned[year]],
    }));
  };

  const [seriesdata, setSeriesData] = useState([
    {
      data: calculateYearlyTotalEarned(),
    },
  ]);

  const option = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 1,
    },
    plotOptions: {
      bar: {
        isDumbbell: true,
        columnWidth: 3,
        dumbbellColors: [["#008FFB", "#00E396"]],
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: "top",
      horizontalAlign: "left",
      customLegendItems: ["Product A", "Product B", "Product C", "Product D"],
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        gradientToColors: ["#00E396"],
        inverseColors: true,
        stops: [0, 100],
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      tickPlacement: "on",
    },
  };
  const series = seriesdata;

  useEffect(() => {
    setSeriesData([
      {
        data: calculateYearlyTotalEarned(),
      },
    ]);
  }, [sales]);

  return (
    <>
      <ApexChart
        type="rangeBar"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </>
  );
}
