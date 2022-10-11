import React from "react";
import Navbar from "./Navbar/Navbar";

export const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
