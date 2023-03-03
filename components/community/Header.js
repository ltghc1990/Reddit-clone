import React, { useContext } from "react";
import { Box, Flex, Icon, Text, Button, Image } from "@chakra-ui/react";

// import RedditFace from "../Layout/Navbar/RedditFace";
import { AuthModalContext } from "../../store/AuthmodalProvider";
import {
  useUserAuth,
  useFetchCommunitySnippets,
  useOnJoinorLeaveCommunity,
  useCommunityData,
} from "../../store/reactQueryHooks";

// props coming from serverside
const Header = ({ communityData: initialCommunityData }) => {
  const { setModalSettings } = useContext(AuthModalContext);
  const { data: user } = useUserAuth();
  const { data: communitySnippets } = useFetchCommunitySnippets();

  const { data: currentCommunity, isLoading: currentIsloading } =
    useCommunityData(initialCommunityData);

  const isJoined = communitySnippets?.find(
    (item) => item.communityId === currentCommunity?.id
  );

  const { isLoading, mutate } = useOnJoinorLeaveCommunity();

  const onClickHandler = () => {
    if (!user) {
      setModalSettings((prev) => ({ ...prev, open: true }));
      return;
    }
    mutate({ isJoined, item: currentCommunity });
  };

  return (
    <>
      <Box h="20" bg="blue.400" />
      <Flex bg="white" h="20">
        <Flex className="w-[95%] max-w-screen-2xl mx-auto px-4">
          <Flex justify="center" align="center" mt="-6" height="full">
            <Box
              maxW="20"
              maxH="20"
              overflow="hidden"
              border="4px"
              borderRadius="full"
              borderColor="white"
            >
              {currentCommunity?.imageURL ? (
                <Image src={currentCommunity.imageURL} alt="community image" />
              ) : (
                <Icon as={RedditFace} />
              )}
            </Box>
          </Flex>
          <Flex mx="4" pt="2">
            <Box mr="4">
              <Text fontWeight="800" fontSize="22px">
                {currentCommunity?.id}
              </Text>
              <Text className="text-xs" color="gray.500">
                r/{currentCommunity?.id}
              </Text>
            </Box>
            <Button
              // variant="outline"
              _hover={!isJoined && { backgroundColor: "blue.600" }}
              isLoading={isLoading}
              onClick={onClickHandler}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Header;

const RedditFace = () => {
  return (
    <svg width="60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <g>
        <circle fill="#FF4500" cx="10" cy="10" r="10"></circle>
        <path
          fill="#FFF"
          d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"
        ></path>
      </g>
    </svg>
  );
};
