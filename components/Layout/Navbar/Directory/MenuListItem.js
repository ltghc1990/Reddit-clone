import React from "react";
import { Box, Flex, Icon, Image, MenuItem, Text } from "@chakra-ui/react";
// import { Link } from "@chakra-ui/react";
import Link from "next/link";

const MenuListItem = ({
  icon,
  displayText,
  link,
  iconColor,
  imageURL,
  onClick,
}) => {
  const test = () => {};
  return (
    <MenuItem onClick={onClick}>
      <Link href={{ pathname: `/r/[communityId]`, query: link }}>
        <Flex align="center">
          {imageURL ? (
            <Image src={imageURL} boxSize="18px" alt="community image" mr="2" />
          ) : (
            <Box mr="2">
              <Icon as={icon} textColor={iconColor} />
            </Box>
          )}
          <Text>{displayText}</Text>
        </Flex>
      </Link>
    </MenuItem>
  );
};

export default MenuListItem;
