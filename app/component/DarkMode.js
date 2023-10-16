import React, { useContext } from "react";
import { ContextData } from "./context/Context.";
import Image from "next/image";

const DarkMode = () => {
  const { sun, moon, mode, SetMode } = useContext(ContextData);

  function setModeLight() {
    if (mode == sun) {
      SetMode(moon);
    } else {
      SetMode(sun);
    }
  }

  return (
    <div
      className={
        mode == moon
          ? "theme-container shadow-dark"
          : "theme-container shadow-light"
      }
      onClick={setModeLight}
    >
      <Image id="theme-icon" src={mode} alt="ERR" width={35} height={35} />
    </div>
  );
};

export default DarkMode;
