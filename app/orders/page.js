"use client";
import { useContext, useEffect, useState } from "react";
import Layout from "../component/Layout";
import axios from "axios";
import { ContextData } from "../component/context/Context.";
import Loader from "../component/Loader";

export default function OrderPage() {
  const { sun, mode } = useContext(ContextData);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);
  return (
    <Layout>
      <div className="main-table-orders">
        <h1>Orders</h1>
        {orders.length == 0 ? (
          <div
            className={
              "loaders-container-main-ord " +
              (mode == sun ? "products-headers-l" : "products-headers-d")
            }
          >
            <div class="left_back"></div>
            <div class="right_back"></div>
            <Loader />
          </div>
        ) : (
          <div className="table-orders-list-main">
            <ul
              className={
                "products-headers overflow-hidden xs:text-xs md:mr-2 " +
                (mode == sun ? "products-headers-l" : "products-headers-d")
              }
            >
              <li className="w-1/4 text-center header">Date</li>
              <li className="w-1/4 text-center header">Paid</li>
              <li className="w-1/4 text-center header">Recipient</li>
              <li className="w-1/4 text-center header">Products</li>
            </ul>
            <div className="list-product-details xs:pr-1.5 lg:pr-0 ">
              {orders.length > 0 &&
                orders.map((item) => (
                  <ul className="products orders" key={item._id}>
                    <li className="w-1/4 text-center">
                      {new Date(item.createdAt).toLocaleString()}
                    </li>
                    <li
                      className={
                        item.paid
                          ? "text-green-600 w-1/4 text-center"
                          : "text-red-600 w-1/4 text-center"
                      }
                    >
                      {item.paid ? "YES" : "NO"}
                    </li>
                    <li className="w-1/4 text-center">
                      {item.name}
                      {item.email}
                      <br />
                      {item.city}
                      {item.postalCode}
                      {item.country}
                      <br />
                      {item.streetAddress}
                    </li>
                    <li className="w-1/4 text-center">
                      {item.line_items.map((l) => (
                        <span key={l}>
                          {l.price_data?.product_data.name} x {l.quantity}{" "}
                          <br />
                        </span>
                      ))}
                    </li>
                  </ul>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
