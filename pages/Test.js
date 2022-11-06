import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ArrowUpRight } from "../components/Layout/Navbar/RightContent/Icons";

const Test = () => {
  return (
    <div className="flex border-4 border-red-400 ">
      <div className="border-2 border-green-500 ">Hello world</div>
      {/* <button className="p-2 text-white bg-blue-500 rounded-lg">Submit</button> */}
    </div>
  );
};

export default Test;
