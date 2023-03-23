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
  toggleCommunityMenu,
}) => {
  return (
    <MenuItem onClick={toggleCommunityMenu}>
      <Link href={{ pathname: `/r/[communityId]`, query: link }}>
        <Flex align="center" width="100%" mr="2">
          <Box mr="2" borderRadius="full" overflow="hidden">
            {imageURL ? (
              <Image src={imageURL} boxSize="18px" alt="community image" />
            ) : (
              <Icon as={icon} textColor={iconColor} />
            )}
          </Box>

          <Text>{displayText}</Text>
        </Flex>
      </Link>
    </MenuItem>
  );
};

export default MenuListItem;
