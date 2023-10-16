"use client";
import dynamic from "next/dynamic";
import { ContextData } from "../context/Context.";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function OrderChart() {
  const { sun, mode } = useContext(ContextData);
  const [totalOrders, setTotalOrders] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Get today's date as a string in ISO format
    const todayDateString = new Date().toISOString().split("T")[0];

    // Filter based on today's date and presence of updatedAt or createdAt
    const filteredResult = totalOrders.filter((item) => {
      const hasUpdatedAt = item.hasOwnProperty("updatedAt");
      const hasCreatedAt = item.hasOwnProperty("createdAt");
      const createdAtDate = new Date(item.createdAt)
        .toISOString()
        .split("T")[0];
      const updatedAtDate = new Date(item.updatedAt)
        .toISOString()
        .split("T")[0];

      return (
        (hasUpdatedAt && updatedAtDate === todayDateString) ||
        (hasCreatedAt && createdAtDate === todayDateString)
      );
    });

    // Update the filteredData state
    setFilteredData(filteredResult);
  }, [totalOrders]);
  // This effect will run whenever 'data' changes

  async function fetchOrders() {
    await axios.get("/api/orders").then((res) => setTotalOrders(res.data));
  }

  const option = {
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: "80%",
          background: mode == sun ? "transparent" : "transparent",
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: "front",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: "#fff",
          strokeWidth: "67%",
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "17px",
          },
          value: {
            formatter: function (val) {
              return parseInt(val);
            },
            color: mode == sun ? "#111" : "#888",
            fontSize: "36px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#ABE5A1"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "smooth",
    },
    labels: ["New Orders"],
  };

  const series = [filteredData.length];

  return (
    <>
      <ApexChart
        type="radialBar"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </>
  );
}
