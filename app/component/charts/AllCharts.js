"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { ContextData } from "../context/Context.";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function AllCharts() {
  const { sun, mode } = useContext(ContextData);

  const [totalOrders, setTotalOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    await axios.get("/api/orders").then((res) => setTotalOrders(res.data));
  }

  const categories = totalOrders.map((order) => {
    const date = new Date(order.createdAt);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  });

  const totalOrdersData = calculateTotalOrdersData(totalOrders, categories);
  const salesData = calculateSalesData(totalOrders, categories);
  const profitData = calculateProfitData(totalOrders, categories);
  const othersData = calculateOthersData(totalOrders, categories);

  const option = {
    dataLabels: {
      enabled: false,
    },
    legend: {
      labels: {
        colors: mode == sun ? "#888" : "#ffffff",
      },
    },
    stroke: {
      curve: "smooth",
      width: 1,
    },
    markers: {
      size: 4,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      type: "datetime",
      categories: categories,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "Total Orders",
      data: totalOrdersData,
    },
    {
      name: "Product Sale Count/Day",
      data: salesData,
    },
    {
      name: "Paid Orders",
      data: profitData,
    },
    {
      name: "Unpaid Orders",
      data: othersData,
    },
  ];

  // Calculate total orders for each category
  function calculateTotalOrdersData(orders, categories) {
    return categories.map(
      (category) =>
        orders.filter(
          (order) =>
            `${new Date(order.createdAt).getFullYear()}-${(
              new Date(order.createdAt).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(order.createdAt)
              .getDate()
              .toString()
              .padStart(2, "0")}` === category
        ).length
    );
  }

  // Calculate sales for each category (you need to define your own logic for this)
  function calculateSalesData(orders, categories) {
    // Implement your logic to calculate sales
    return categories.map(
      (category) =>
        orders.filter(
          (order) =>
            `${new Date(order.createdAt).getFullYear()}-${(
              new Date(order.createdAt).getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date(order.createdAt)
              .getDate()
              .toString()
              .padStart(2, "0")}` === category
        ).length
    );
  }

  // Calculate profit for each category (you need to define your own logic for this)
  // Calculate the count of paid orders for each category
  function calculateProfitData(orders, categories) {
    return categories.map((category) => {
      // Filter paid orders for the given category
      const paidOrders = orders.filter(
        (order) =>
          order.paid &&
          `${new Date(order.createdAt).getFullYear()}-${(
            new Date(order.createdAt).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(order.createdAt)
            .getDate()
            .toString()
            .padStart(2, "0")}` === category
      );

      // Count the number of paid orders for the category
      const paidOrdersCount = paidOrders.length;

      return paidOrdersCount;
    });
  }

  // Calculate "Others" data for each category (you need to define your own logic for this)
  function calculateOthersData(orders, categories) {
    // Implement your logic to calculate "Others" data
    return categories.map((category) => {
      // Filter paid orders for the given category
      const paidOrders = orders.filter(
        (order) =>
          !order.paid &&
          `${new Date(order.createdAt).getFullYear()}-${(
            new Date(order.createdAt).getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${new Date(order.createdAt)
            .getDate()
            .toString()
            .padStart(2, "0")}` === category
      );

      // Count the number of paid orders for the category
      const paidOrdersCount = paidOrders.length;

      return paidOrdersCount;
    });
  }

  return (
    <>
      <ApexChart
        type="area"
        options={option}
        series={series}
        height="100%"
        width="100%"
      />
    </>
  );
}
