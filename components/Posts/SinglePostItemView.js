import React, { useState, useContext } from "react";
import moment from "moment";
import {
  Flex,
  Icon,
  Box,
  Text,
  Stack,
  HStack,
  Image,
  Skeleton,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
// icons for the post
import {
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleIcon,
  DeleteIcon,
} from "../Icons";

import { useRouter } from "next/router";

import { onDeletePost, onPostVote } from "../../firebase/firebaseFunctions";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthModalContext } from "../../store/AuthModalProvider";

const SinglePostItem = ({ post, user, userIsCreator, existingVoteValue }) => {
  const router = useRouter();
  const { setModalSettings } = useContext(AuthModalContext);
  const queryClient = useQueryClient();

  const [loadingImage, setLoadingImage] = useState(true);
  const { isLoading, error, mutate } = useMutation(onDeletePost);
  // voting system
  const { mutate: postVoteMutate } = useMutation(onPostVote);

  const handleDelete = () => {
    mutate(post, {
      onSuccess: () => {
        queryClient.setQueryData(["posts", post.id], []);
        router.back();
      },
    });
  };

  const handleVote = (voteValue, event) => {
    event.stopPropagation();
    if (!user) {
      // bring up the modal to login/sign in
      setModalSettings((prev) => ({ ...prev, open: true }));
      return;
    } else {
      console.log("handlevote");
      postVoteMutate(
        { post, voteValue, existingVoteValue, user },
        {
          onSuccess: (response) => {
            console.log("vote mutation successful, response:", response);
            //  dont want to invalidate as that would cause use to have to refetch all the users postvotes as well as all the posts in the post collection
            // need to update post voteStatus
            // need to update users postvotes
            const postsCache = queryClient.getQueryData(["posts", post.id]);
            const userPostVotesCache = queryClient.getQueryData([
              "userPostVotes",
            ]);
            // if/else statement, if the voteValue does not exist we are deleting and if it does exist we are adding/replacing

            if (!response.voteObject.voteValue) {
              // remove vote from user + update post voteStatus
              const updatedPostCache = postsCache.map((post) => {
                if (post.id === response.voteObject.id) {
                  return {
                    ...post,
                    voteStatus: response.postVoteStatus,
                  };
                }
                return post;
              });
              const updatedUserPostVotesCache = userPostVotesCache.filter(
                (item) => item?.id !== response.voteObject.id ?? []
              );
              queryClient.setQueryData(["posts", post.id], updatedPostCache);
              queryClient.setQueryData(
                ["userPostVotes"],
                updatedUserPostVotesCache
              );
            } else {
              // post voteStatus needs to be updated eitherway

              // if the response id does not exist in the cache then we add it to the array instead of updating it with the new vote value
              const doesItExist = userPostVotesCache.filter(
                (item) => item.id === response.voteObject.id
              );

              if (doesItExist.length >= 1) {
                // user updating their vote value
                const updatedUserPostVotes = userPostVotesCache.map((item) => {
                  if (item.id === response.voteObject.id) {
                    return {
                      ...item,
                      voteValue: response.voteObject.voteValue,
                    };
                  }
                  return item;
                });

                queryClient.setQueryData(
                  ["userPostVotes"],
                  updatedUserPostVotes
                );
              } else {
                // add voteobject to users postvotes and update the post vote status
                queryClient.setQueryData(
                  ["userPostVotes"],
                  [...userPostVotesCache, { ...response.voteObject }]
                );
              }

              const updatedPost = postsCache.map((post) => {
                if (post.id === response.voteObject.id) {
                  return {
                    ...post,
                    voteStatus: response.postVoteStatus,
                  };
                }
                return post;
              });

              queryClient.setQueryData(["posts", post.id], updatedPost);
            }
          },
        }
      );
    }
  };

  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="white"
      borderRadius="4px 4px 0px 0px"
    >
      <Flex
        display={{ base: "none", md: "flex" }}
        direction="column"
        align="center"
        width="10"
        flexShrink="0"
        pt="2"
      >
        <Box
          color={existingVoteValue === 1 ? "red.500" : "gray.400"}
          cursor="pointer"
          onClick={(event) => handleVote(1, event)}
        >
          <Icon as={ArrowUpCircleIcon} />
        </Box>
        <Text fontWeight="bold" fontSize="12">
          {post.voteStatus}
        </Text>
        <Box
          color={existingVoteValue === -1 ? "#4379ff" : "gray.400"}
          cursor="pointer"
          onClick={(event) => handleVote(-1, event)}
        >
          <Icon as={ArrowDownCircleIcon} />
        </Box>
      </Flex>
      <Flex direction="column" px="2" width="100%">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>Error Deleting Post</AlertDescription>
          </Alert>
        )}
        <Stack spacing="1" direction="column">
          <HStack align="center" fontSize={12} py="10px">
            {/* icon if we are on the home page do not show icon */}
            <Text mt="2">
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </HStack>
          <Text fontWeight="semibold" textColor="gray.800">
            {post.title}
          </Text>
          <Text fontSize="14">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center">
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius="4" />
              )}
              <Image
                src={post.imageURL}
                onLoad={() => setLoadingImage(false)}
                display={loadingImage ? "none" : "unset"}
                alt="post image"
                p="2"
                maxHeight="460px"
              />
            </Flex>
          )}
        </Stack>
        <HStack spacing={1} my="2" fontSize="12" textColor="gray.600">
          <MobileVotingView
            existingVoteValue={existingVoteValue}
            voteStatus={post.voteStatus}
            handleVote={handleVote}
          />
          <IconWrapper>
            <Icon as={ChatBubbleIcon} />
            <Text pl="1">{post.numberOfComments} comments</Text>
          </IconWrapper>
          <Flex display={{ base: "none", sm: "flex" }}>
            <IconWrapper>
              <Icon as={ShareIcon} />
              <Text pl="1">Share</Text>
            </IconWrapper>
            <IconWrapper>
              <Icon as={BookmarkIcon} />
              <Text pl="1">Save</Text>
            </IconWrapper>

            {userIsCreator && (
              <IconWrapper onClick={handleDelete}>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <>
                    <Icon as={DeleteIcon} />
                    <Text p1="1">Delete</Text>
                  </>
                )}
              </IconWrapper>
            )}
          </Flex>
        </HStack>
      </Flex>
    </Flex>
  );
};
export default SinglePostItem;

const IconWrapper = ({ children, onClick }) => {
  return (
    <Flex
      fontSize="12"
      textColor="gray.500"
      cursor="pointer"
      fontWeight="bold"
      onClick={onClick}
      align="center"
      p="2"
      borderRadius="lg"
      _hover={{ bg: "gray.200", textColor: "gray.600" }}
    >
      {children}
    </Flex>
  );
};

const MobileVotingView = ({ existingVoteValue, voteStatus, handleVote }) => {
  return (
    <Flex align="center" display={{ base: "flex", md: "none" }}>
      <Box
        color={existingVoteValue === 1 ? "red.500" : "gray.400"}
        onClick={(event) => handleVote(1, event)}
      >
        <Icon as={ArrowUpCircleIcon} />
      </Box>
      <Text fontWeight="bold" fontSize="12">
        {voteStatus}
      </Text>
      <Box
        color={existingVoteValue === -1 ? "#4379ff" : "gray.400"}
        onClick={(event) => handleVote(-1, event)}
      >
        <Icon as={ArrowDownCircleIcon} />
      </Box>
    </Flex>
  );
};
