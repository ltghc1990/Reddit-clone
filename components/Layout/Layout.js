import React from "react";
import Navbar from "./Navbar/Navbar";

import { useCommunityMenu } from "../../store/CommunityMenuProvider";

export const Layout = ({ children }) => {
  const { closeMenu } = useCommunityMenu();

  return (
    <div onClick={closeMenu}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};
