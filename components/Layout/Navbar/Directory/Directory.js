import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import RedditFace from "../RedditFace";

import Communities from "./Communities";

import { useCommunityMenu } from "../../../../store/CommunityMenuProvider";
import { useCommunityData } from "../../../../store/reactQueryHooks";

const Directory = () => {
  const { isOpen, toggleCommunityMenu, buttonRef } = useCommunityMenu();
  const homeFeed = {
    id: "Home",
    imageURL: HouseIcon,
  };

  const { data: currentCommunity } = useCommunityData(homeFeed);

  return (
    <Box mr={{ base: "auto" }}>
      <Menu isOpen={isOpen}>
        <MenuButton
          size={{ base: "xs", sm: "sm", md: "md" }}
          maxWidth={{ base: "105px", sm: "unset" }}
          ref={buttonRef}
          onClick={toggleCommunityMenu}
          as={Button}
          bgColor="white"
          borderRadius={6}
          mr="2"
          _hover={{ outline: "1px solid", outlineColor: "gray.400" }}
          rightIcon={<ChevronDownIcon />}
        >
          <Flex align="center">
            {currentCommunity?.imageURL ? (
              <Flex boxSize={6} mr="2" borderRadius="full" overflow="hidden">
                {currentCommunity.id == "Home" ? (
                  <Icon as={HouseIcon} />
                ) : (
                  <Image
                    src={currentCommunity.imageURL}
                    alt={currentCommunity.id}
                  />
                )}
              </Flex>
            ) : (
              <Box mr="2">
                <Icon as={() => RedditFace({ size: "24px" })} />
              </Box>
            )}

            <Text>{currentCommunity?.id}</Text>
          </Flex>
        </MenuButton>
        <MenuList onClick={(e) => e.stopPropagation()}>
          <Communities homeFeed={homeFeed} />
        </MenuList>
      </Menu>
    </Box>
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
