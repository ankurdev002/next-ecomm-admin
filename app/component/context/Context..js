"use client";
import React, { createContext, useEffect, useState } from "react";

export const ContextData = createContext();

const Context = ({ children }) => {
  const sun =
    "https://www.uplooder.net/img/image/55/7aa9993fc291bc170abea048589896cf/sun.svg";
  const moon =
    "https://www.uplooder.net/img/image/2/addf703a24a12d030968858e0879b11e/moon.svg";

  const [mode, SetMode] = useState(sun);
  const [visitorCount, setVisitorCount] = useState(null);

  useEffect(() => {
    // Fetch visitor count from your Next.js API route on page load
    fetch("/api/visitors")
      .then((response) => response.json())
      .then((data) => {
        setVisitorCount(data.count);
        incrementVisitorCount();
      })
      .catch((error) => console.error("Error fetching visitor count:", error));
  }, []);

  function incrementVisitorCount() {
    // Send a POST request to increment the visitor count
    fetch("/api/visitors", { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log("Visitor count incremented:", data.count))
      .catch((error) =>
        console.error("Error incrementing visitor count:", error)
      );
  }

  return (
    <ContextData.Provider value={{ sun, moon, mode, SetMode, visitorCount }}>
      {children}
    </ContextData.Provider>
  );
};

export default Context;
