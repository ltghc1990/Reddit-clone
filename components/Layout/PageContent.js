import React from "react";
import { Flex } from "@chakra-ui/react";
const PageContent = ({ children }) => {
  return (
    <Flex
      justify="center"
      mx="auto"
      className=" max-w-screen-2xl"
      py={{ base: 4, md: 6, lg: 8 }}
    >
      <Flex className="w-full " py="4" px="4">
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: "6" }}
        >
          {children[0]}
        </Flex>
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow="1"
        >
          {children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PageContent;
