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

import { AuthModalContext } from "../../store/AuthmodalProvider";

const PostItem = ({
  post,
  user,
  userIsCreator,
  existingVoteValue,
  setSelectedPost,
}) => {
  const { setModalSettings } = useContext(AuthModalContext);
  const router = useRouter();
  const queryClient = useQueryClient();

  // for styling purposes
  const singlePostItem = !setSelectedPost;

  const [loadingImage, setLoadingImage] = useState(true);
  const { isLoading, error, mutate } = useMutation(onDeletePost);
  // voting system
  const { mutate: postVoteMutate } = useMutation(onPostVote);

  const onSelectPost = () => {
    if (!setSelectedPost) return;
    queryClient.setQueryData(["selectedPost"], { ...post });
    router.push(`${router.asPath}/comments/${post.id}`);
    //  since we route to a new page the refresh removes all our cache stored in the keys.
    //  selected post put into a context, take the users postVotes and also put it into state
    setSelectedPost(post);
  };

  const handleDelete = () => {
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
      onClick={onSelectPost}
    >
      <Flex
        direction="column"
        align="center"
        width="10"
        bg="gray.200"
        flexShrink="0"
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
      <Flex direction="column" px="2">
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>Error Deleting Post</AlertDescription>
          </Alert>
        )}
        <Stack spacing="1">
          <HStack>
            {/* icon if we are on the home page do not show icon */}
            <Text mt="2">
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </HStack>
          <Text fontWeight="semibold">{post.title}</Text>
          <Text>{post.body}</Text>
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
        <HStack my="2" fontSize="12">
          <Flex
            align="center"
            py="2"
            px="3"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={ChatBubbleIcon} />
            <Text>{post.numberOfComments}</Text>
          </Flex>

          <Flex
            align="center"
            py="2"
            px="3"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={ShareIcon} />
            <Text>Share</Text>
          </Flex>

          <Flex
            align="center"
            py="2"
            px="3"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
          >
            <Icon as={BookmarkIcon} />
            <Text>Save</Text>
          </Flex>
          {userIsCreator && (
            <Flex
              align="center"
              py="2"
              px="3"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              onClick={handleDelete}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={DeleteIcon} />
                  <Text>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </HStack>
      </Flex>
    </Flex>
  );
};
export default PostItem;
