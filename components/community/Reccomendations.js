import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { getCommunityReccomendations } from "../../firebase/firebaseFunctions";
import {
  useFetchCommunitySnippets,
  useOnJoinorLeaveCommunity,
} from "../../store/reactQueryHooks";

import RedditFace from "../Layout/Navbar/RedditFace";

const Reccomendations = () => {
  const { mutate, isLoading: loadingMutation } = useOnJoinorLeaveCommunity();
  const {
    data: topCommunities,
    isLoading,
    error,
  } = useQuery(["topCommunities"], getCommunityReccomendations, {
    onError: (error) => console.log(error),
  });

  const { data: communitySnippets } = useFetchCommunitySnippets();

  return (
    <>
      <Flex
        direction="column"
        bg="white"
        borderRadius="4"
        border="1px solid"
        borderColor="gray.300"
      >
        <Flex
          align="flex-end"
          fontWeight="700"
          bottom="0"
          textColor="white"
          p="6px 10px"
          bgImage="url(/images/reddit-banner.jpg)"
          h="70px"
          backgroundSize="cover"
          backgroundPosition="center"
          bgRepeat="no-repeat"
          borderRadius="4px 4px 0px 0px"
          bgGradient="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75)),url(/images/reddit-banner.jpg)"
        >
          Top Communities
        </Flex>
        <Flex direction="column">
          {isLoading ? (
            <SkeletonLoaders />
          ) : (
            <>
              {topCommunities.map((item, index) => {
                const isJoined = !!communitySnippets?.find(
                  (snippet) => snippet.communityId === item.id
                );

                return (
                  <Link key={item.id} href={`/r/${item.id}`}>
                    <Flex
                      position="relative"
                      align="center"
                      borderColor="gray.200"
                      borderBottom="1px solid"
                      p="10px 12px"
                    >
                      <Flex width="80%" align="center">
                        <Flex width="15%">
                          <Text>{index + 1}</Text>
                        </Flex>
                        <Flex align="center" width="80%">
                          {item.imageURL ? (
                            <Image
                              src={item.imageURL}
                              alt={`${item.id} image`}
                              boxSize="20px"
                              borderRadius="full"
                              mr="2"
                            />
                          ) : (
                            <Box mr="2">
                              <Icon as={() => RedditFace({ size: "20px" })} />
                            </Box>
                          )}
                          <span className="overflow-hidden font-semibold text-gray-700 cursor-pointer whitespace-nowrap text-ellipsis">
                            {`r/${item.id}`}
                          </span>
                        </Flex>
                      </Flex>
                      <Box position="absolute" right="10px">
                        <Button
                          size="sm"
                          borderRadius="full"
                          py="3"
                          px="6"
                          fontSize="14px"
                          bgColor={isJoined ? "gray.200" : "blue.500"}
                          _hover={
                            isJoined
                              ? { bgColor: "gray.400", color: "white" }
                              : { bgColor: "blue.400" }
                          }
                          color={isJoined ? "gray.500" : "white"}
                          onClick={(e) => {
                            e.stopPropagation();
                            mutate({ isJoined, item });
                          }}
                        >
                          {isJoined ? "Joined" : "Join"}
                        </Button>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
              <Box p="10px 20px">
                <Button height="36px" width="100%" borderRadius="full">
                  View All
                </Button>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Reccomendations;

const SkeletonLoaders = () => {
  return (
    <Stack mt={2} p={3}>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <SkeletonCircle size="10" />
        <Skeleton height="10px" width="70%" />
      </Flex>
    </Stack>
  );
};
