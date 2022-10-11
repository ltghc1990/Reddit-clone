import { Box } from "@chakra-ui/react";

// logos and stuff
import RedditFace from "./RedditFace";
import RedditLogo from "./RedditLogo";
import { Flex, HStack } from "@chakra-ui/react";

// components
import RightContent from "./RightContent/RightContent";
import SearchInput from "./SearchInput";
import Directory from "./Directory/Directory";

// logic
import { useOnAuthChange, useUserAuth } from "../../../store/reactQueryHooks";

const Navbar = () => {
  useOnAuthChange();
  const { data: user } = useUserAuth();
  return (
    <Flex
      className="justify-between outline"
      bg={"white"}
      height="12"
      px="4"
      py="6"
      align={"center"}
    >
      <HStack align={"center"} space="4" mr={4}>
        <RedditFace />
        <Box display={{ base: "none", md: "unset" }}>
          <RedditLogo />
        </Box>
      </HStack>
      {user && <Directory />}

      <SearchInput />

      <RightContent />
    </Flex>
  );
};

export default Navbar;
