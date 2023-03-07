import React, { useState, useContext } from "react";
import Link from "next/link";
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
import RedditFace from "../Layout/Navbar/RedditFace";

import { useRouter } from "next/router";

import { onDeletePost, onPostVote } from "../../firebase/firebaseFunctions";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AuthModalContext } from "../../store/AuthModalProvider";

const PostItem = ({
  post,
  user,
  userIsCreator,
  existingVoteValue,
  homePage,
}) => {
  const { setModalSettings } = useContext(AuthModalContext);

  const router = useRouter();
  const queryClient = useQueryClient();

  const [loadingImage, setLoadingImage] = useState(true);
  const { isLoading, error, mutate } = useMutation(onDeletePost);
  // voting system
  const { mutate: postVoteMutate } = useMutation(onPostVote);

  const onSelectPost = () => {
    queryClient.setQueryData(["posts", post.id], { ...post });
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    mutate(post, {
      onSuccess: () => {
        console.log("post successfully deleted");
        // grab the posts from the cache
        const outdatedCache = queryClient.getQueryData(["posts"]);
        // filter out the post and manually update the cache
        const currentCache = outdatedCache.filter(
          (item) => item.id !== post.id
        );
        queryClient.setQueryData(["posts"], currentCache);
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
            const postsCache = queryClient.getQueryData(["posts"]);
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
              queryClient.setQueryData(["posts"], updatedPostCache);
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
                console.log(doesItExist);
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
                const updatedUserPostVotes = [
                  ...userPostVotesCache,
                  { ...response.voteObject },
                ];
                queryClient.setQueryData(
                  ["userPostVotes"],
                  updatedUserPostVotes
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

              queryClient.setQueryData(["posts"], updatedPost);
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
      borderColor="gray.300"
      cursor="pointer"
      borderRadius="4"
      _hover={{ borderColor: "gray.500" }}
      onClick={onSelectPost}
    >
      <Flex
        direction="column"
        align="center"
        width="10"
        bg="gray.200"
        flexShrink="0"
        pt="2"
      >
        <Box
          color={existingVoteValue === 1 ? "red.500" : "gray.400"}
          onClick={(event) => handleVote(1, event)}
        >
          <Icon as={ArrowUpCircleIcon} />
        </Box>
        <Text fontSize="9">{post.voteStatus}</Text>
        <Box
          color={existingVoteValue === -1 ? "#4379ff" : "gray.400"}
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
        <Stack spacing={1} direction="column">
          <HStack align="center" fontSize={12} py="10px">
            {/* if on home page show community icon so they can click and go it= */}
            {homePage && (
              <>
                {post.communityImageURL ? (
                  <Image
                    boxSize={7}
                    borderRadius="full"
                    src={post.communityImageURL}
                    alt={post.communityId}
                  />
                ) : (
                  <Icon as={() => RedditFace({ fill: "blue", size: "28px" })} />
                )}
                <Link href={`/r/${post.communityId}`}>
                  <Text
                    fontWeight="bold"
                    ml="2"
                    _hover={{
                      textDecorationLine: "underline",
                      textDecorationColor: "blue.600",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {`r/${post.communityId}`}
                  </Text>
                </Link>
              </>
            )}
            <Text textColor="gray.600">
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
          <IconWrapper>
            <Icon as={ChatBubbleIcon} />
            <Text pl="1">{post.numberOfComments} comments</Text>
          </IconWrapper>
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
        </HStack>
      </Flex>
    </Flex>
  );
};
export default PostItem;

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
