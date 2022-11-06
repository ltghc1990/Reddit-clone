import React from "react";
import { Flex } from "@chakra-ui/react";
const PageContent = ({ children }) => {
  return (
    <Flex
      justify="center"
      mx="auto"
      className="border-2 border-red-500 max-w-screen-2xl"
    >
      <Flex className="w-full border-2 border-blue-500" py="4" px="4">
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: "6" }}
          className="border-2 border-green-500 "
        >
          {children[0]}
        </Flex>
        <Flex
          direction="column"
          border="2px solid green"
          display={{ base: "none", md: "flex" }}
          flexGrow="1"
        >
          {children[1]}
        </Flex>
        {/* <div className="flex-col hidden md:flex">{children[1]}</div> */}
      </Flex>
    </Flex>
  );
};

export default PageContent;
