/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../context/Context.";
import axios from "axios";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function RevenueChart() {
  const { sun, mode } = useContext(ContextData);
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [earnedRev, setEarnedRev] = useState([]);
  const [totalRev, setTotalRev] = useState("");
  const [earnedTotal, setEarnedTotal] = useState("");

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    if (sales.length > 0) {
      getRevenue();
    }
  }, [sales]); // Update revenue when sales change

  useEffect(() => {
    if (revenue.length > 0) {
      TotalRevenue();
    }
  }, [revenue]); // Calculate totalRev when revenue changes

  // get all orders
  async function fetchDetails() {
    await axios.get("/api/orders").then((res) => setSales(res.data));
  }

  // get all oredered products prices in array using flat map
  function getRevenue() {
    const EarnedrevenueData = sales.flatMap(
      (item) =>
        item.paid &&
        item.line_items.map(
          (val) => (val.price_data.unit_amount / 100) * val.quantity
        )
    );
    const revenueData = sales.flatMap((item) =>
      item.line_items.map(
        (val) => (val.price_data.unit_amount / 100) * val.quantity
      )
    );

    setEarnedRev(EarnedrevenueData);
    setRevenue(revenueData);
  }

  // find total sum revenue
  function TotalRevenue() {
    const totalEarn = earnedRev.reduce((acc, curVal) => acc + curVal, 0);
    const totalRevEarn = revenue.reduce((acc, curVal) => acc + curVal, 0);

    setTotalRev(totalEarn);
    setEarnedTotal(totalRevEarn);
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
              return val.toFixed(2) + "%";
            },
            color: mode == sun ? "#111" : "#888",
            fontSize: "18px",
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
    labels: ["Revenue"],
  };

  const series = [(totalRev / earnedTotal) * 100];

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
