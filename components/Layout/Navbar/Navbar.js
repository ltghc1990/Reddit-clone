import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  useOnAuthChange();
  const { data: user } = useUserAuth();

  const onClickHandler = () => {
    // ideally when we click a link its a hard refresh and we dont have to invalidate react query stuff but some weird stuff is conflicting with router/Link js and reactjs
    // here we need to invalidate the community and its post
  };

  return (
    <Flex
      className="justify-between outline"
      bg={"white"}
      height="12"
      px="4"
      py="6"
      align={"center"}
    >
      <HStack
        align={"center"}
        space="4"
        mr={4}
        cursor="pointer"
        onClick={() => router.push("/")}
      >
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
