import React from "react";
import Navbar from "./Navbar/Navbar";
import { useCommunityMenu } from "../../store/OpenCommunityMenuP";

export const Layout = ({ children }) => {
  const { setIsOpen } = useCommunityMenu();
  return (
    <div onClick={() => setIsOpen(false)}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
