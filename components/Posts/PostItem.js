import React, { useState } from "react";
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

import { onDeletePost } from "../../firebase/firebaseFunctions";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const PostItem = ({
  post,
  user,
  userIsCreator,
  userVoteValue,
  existingVote,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);

  const queryClient = useQueryClient();

  const { isLoading, error, mutate } = useMutation(onDeletePost);

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

  const handleVote = () => {
    if (!user) {
      // bring up the modal to login/sign in
      return;
    }

    // check if we have voted before
  };

  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      cursor="pointer"
      borderRadius="4"
    >
      <Flex
        direction="column"
        align="center"
        width="10"
        bg="gray.200"
        flexShrink="0"
      >
        <Box
          color={userVoteValue === 1 ? "red.500" : "gray.400"}
          onClick={() => {}}
        >
          <Icon as={ArrowUpCircleIcon} />
        </Box>
        <Text fontSize="9">{post.voteStatus}</Text>
        <Box
          color={userVoteValue === 1 ? "#4379ff" : "gray.400"}
          onClick={() => {}}
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
              Posted by u/{post.creatorDisplayName}
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
