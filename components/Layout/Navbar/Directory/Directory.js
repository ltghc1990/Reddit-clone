import React from "react";

import {
  Button,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

import Communities from "./Communities";

const Directory = () => {
  return (
    <div>
      <Menu>
        <MenuButton
          as={Button}
          bgColor="white"
          borderRadius={6}
          mr="2"
          _hover={{ outline: "1px solid", outlineColor: "gray.400" }}
          rightIcon={<ChevronDownIcon />}
        >
          <Flex align="center">
            <Icon as={HouseIcon} mr={{ base: 0, md: 2 }} />
            <Text display={{ base: "none", md: "block" }}>Home</Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <Communities />
        </MenuList>
      </Menu>
    </div>
  );
};

export default Directory;

// icons
const HouseIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
};
