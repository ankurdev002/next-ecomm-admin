/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AllCharts } from "./charts/AllCharts";
import { TotalEarned } from "./charts/TotalEarned";
import { OrderChart } from "./charts/OrderChart";
import { RevenueChart } from "./charts/RevenueSales";
import { DailySales } from "./charts/DailySales";
import { ContextData } from "./context/Context.";
import axios from "axios";

const ChartsLayout = () => {
  const { sun, mode, visitorCount } = useContext(ContextData);

  const [totalOrders, setTotalOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [totalRev, setTotalRev] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (totalOrders.length > 0) {
      getSales();
    }
  }, [totalOrders]);

  useEffect(() => {
    if (revenue.length > 0) {
      TotalRevenue();
    }
  }, [revenue]);

  async function fetchOrders() {
    await axios.get("/api/orders").then((res) => setTotalOrders(res.data));
  }

  function getSales() {
    const revenueData = totalOrders.flatMap((item) =>
      item.line_items.map(
        (val) => (val.price_data.unit_amount / 100) * val.quantity
      )
    );

    setRevenue(revenueData);
  }

  function TotalRevenue() {
    const totalEarn = revenue.reduce((acc, curVal) => acc + curVal, 0);

    setTotalRev(totalEarn);
  }

  const colorMode = mode == sun ? "#888" : "#fff";

  return (
    <div className="container-grid">
      <div className="total-count">
        <div
          className={
            "total-price " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <div className="icon-counter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={colorMode}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <h3 style={{ color: colorMode }} className="res-chart-heading">
              Customers
            </h3>
            <div>
              <h1
                style={{ color: colorMode }}
                className="res-chart-heading-sub"
              >
                456677
              </h1>
            </div>
          </div>
        </div>
        <div
          className={
            "total-price " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <div className="icon-counter">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={colorMode}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                />
              </svg>
            </div>
            <div>
              <h3 style={{ color: colorMode }} className="res-chart-heading">
                Orders
              </h3>
            </div>

            <div>
              <h1
                style={{ color: colorMode }}
                className="res-chart-heading-sub"
              >
                {totalOrders.length}
              </h1>
            </div>
          </div>
        </div>
        <div
          className={
            "total-price " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <div className="icon-counter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={colorMode}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>

            <h3 style={{ color: colorMode }} className="res-chart-heading">
              Total Sales
            </h3>
            <div>
              <h1
                style={{ color: colorMode }}
                className="res-chart-heading-sub"
              >
                {totalRev.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                })}
              </h1>
            </div>
          </div>
        </div>
        <div
          className={
            "total-price " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <div className="icon-counter">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={colorMode}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>

            <h3 style={{ color: colorMode }} className="res-chart-heading">
              Visitors
            </h3>
            <div>
              <h1
                style={{ color: colorMode }}
                className="res-chart-heading-sub"
              >
                {visitorCount}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="graphs-represent">
        <div
          className={
            "graph-all " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <AllCharts />
        </div>
        <div
          className={
            "total-visitors " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <TotalEarned />
        </div>
      </div>
      <div
        className={
          "cricular-bar-data " +
          +(mode == sun ? "chart-back-light" : "chart-back-dark")
        }
      >
        <div
          className={
            "orders-all " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <OrderChart />
        </div>
        <div
          className={
            "revenue-sales " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <RevenueChart />
        </div>

        <div
          className={
            "daily-sales " +
            (mode == sun ? "chart-back-light" : "chart-back-dark")
          }
        >
          <DailySales />
        </div>
      </div>
    </div>
  );
};

export default ChartsLayout;
