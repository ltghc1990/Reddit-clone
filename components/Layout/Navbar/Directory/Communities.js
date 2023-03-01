import { Box, Icon, MenuItem, Text, Link } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
// import Link from "next/link";
// next links removes query keys....
import { useQueryClient } from "@tanstack/react-query";

import { AddIcon } from "@chakra-ui/icons";
import RedditFace from "../RedditFace";

import MenuListItem from "./MenuListItem";

import CreateCommunityModal from "../../../Modal/CreateCommunity/CreateCommunityModal";
import {
  useFetchCommunitySnippets,
  getFirestoreCommunityData,
} from "../../../../store/reactQueryHooks";
import { fetchPosts } from "../../../../firebase/firebaseFunctions";
import { useCommunityMenu } from "../../../../store/CommunityMenuProvider";

const Communities = () => {
  const { toggleCommunityMenu } = useCommunityMenu();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useFetchCommunitySnippets();

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
          MODERATING
        </Text>
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
                  onClick={() => onCommunityClick(item.communityId)}
                />
              );
            })}
      </Box>
      <Box mt="3" mb="4">
        <Text pl="3" mb="1" fontSize="7" fontWeight="bold" textColor="gray.500">
          MY COMMUNITIES{" "}
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
                onClick={() => onCommunityClick(item.communityId)}
              />
            );
          })}
      </Box>
    </>
  );
};

export default Communities;

// might be easier if we have selectedcommunity as local state.
// starting value will be home icon + home name,
// we use router to determine the community name
// when the variable router name changes it reruns the react query with the name causing self update

//
