import { Box, Icon, MenuItem, Text, Link, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
// import Link from "next/link";
// next links removes query keys....
import { useQueryClient } from "@tanstack/react-query";

import { AddIcon } from "@chakra-ui/icons";
import RedditFace from "../RedditFace";

import MenuListItem from "./MenuListItem";

import CreateCommunityModal from "../../../Modal/CreateCommunity/CreateCommunityModal";
import { useFetchCommunitySnippets } from "../../../../store/reactQueryHooks";
import { useCommunityMenu } from "../../../../store/CommunityMenuProvider";
import { useUserAuth } from "../../../../store/reactQueryHooks";
const Communities = ({ homeFeed }) => {
  const { toggleCommunityMenu } = useCommunityMenu();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useFetchCommunitySnippets();

  const { data: user } = useUserAuth();

  // maybe dont have links but have onclicks which sets the querykey
  // things to invalidate
  // currentCommunity,
  // posts
  const onCommunityClick = (communityId) => {
    // check because we change the community that it updates all post
    // url needs to update withotu removing the reactquery keys

    // test if we even need this since we did the app router key thing

    toggleCommunityMenu();
    // queryClient.fetchQuery(["currentCommunity"], () =>
    //   getFirestoreCommunityData(communityId)
    // );
    // queryClient.fetchQuery(["posts"], () => fetchPosts({ id: communityId }));
    // router.push(`/r/${communityId}`);
    // queryClient.invalidateQueries(["currentCommunity"]);
    // queryClient.invalidateQueries(["posts"]);
  };
  return (
    <>
      <CreateCommunityModal
        open={open}
        handleClose={() => {
          toggleCommunityMenu();
          setOpen(false);
        }}
      />
      <Box mt="3" mb="4">
        <Text pl="3" mb="1" fontSize="7" fontWeight="bold" textColor="gray.500">
          Feed
        </Text>

        <MenuItem
          onClick={() => {
            toggleCommunityMenu();
            router.push("/");
          }}
        >
          <Flex align="center">
            <Icon as={homeFeed.imageURL} mr="2" />
            <Text>{homeFeed.id}</Text>
          </Flex>
        </MenuItem>

        {user && (
          <Text
            pl="3"
            mb="1"
            fontSize="7"
            fontWeight="bold"
            textColor="gray.500"
          >
            MODERATING
          </Text>
        )}

        {data &&
          data
            .filter((item) => item.isModerator)
            .map((item) => {
              return (
                <MenuListItem
                  key={item.communityId}
                  icon={() => RedditFace({ size: "18px", fill: "red" })}
                  displayText={`r/${item.communityId}`}
                  imageURL={item.imageURL}
                  link={{ communityId: item.communityId }}
                  toggleCommunityMenu={toggleCommunityMenu}
                />
              );
            })}
      </Box>
      {user && (
        <Box mt="3" mb="4">
          <Text
            pl="3"
            mb="1"
            fontSize="7"
            fontWeight="bold"
            textColor="gray.500"
          >
            MY COMMUNITIES
          </Text>
          <MenuItem onClick={() => setOpen(true)}>
            <Icon as={AddIcon} mr="2" />
            <Text fontSize={14}>Create Community</Text>
          </MenuItem>
          {data &&
            data.map((item) => {
              return (
                <MenuListItem
                  key={item.communityId}
                  icon={() => RedditFace({ size: "18px", fill: "blue" })}
                  displayText={`r/${item.communityId}`}
                  imageURL={item.imageURL}
                  link={{ communityId: item.communityId }}
                  toggleCommunityMenu={toggleCommunityMenu}
                />
              );
            })}
        </Box>
      )}
    </>
  );
};

export default Communities;

// might be easier if we have selectedcommunity as local state.
// starting value will be home icon + home name,
// we use router to determine the community name
// when the variable router name changes it reruns the react query with the name causing self update

//
