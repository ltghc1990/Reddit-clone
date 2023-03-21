import React, { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../../firebase/firebaseFunctions";

import { Flex, Button, Text, Textarea, Box, HStack } from "@chakra-ui/react";

import AuthButtons from "../../Layout/Navbar/RightContent/AuthButtons";

// user needs to be logged in order to see component
const CommentInput = ({ user, communityId, selectedPost }) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const { mutate, isLoading } = useMutation(createComment);

  const onSubmitHandler = () => {
    mutate(
      {
        comment,
        communityId,
        selectedPost,
        user,
      },
      {
        onError: (error) => console.log(error),
        onSuccess: (response) => {
          //  after the comment has been added need to show comment + update post
          // might just invalidate since you want to see all latest comments
          console.log("created comment: response:", response);
          setComment("");
          // update the numberofcomments on the current post
          const postCache = queryClient.getQueryData([
            "posts",
            selectedPost.id,
          ]);
          queryClient.setQueryData(
            ["posts", selectedPost.id],
            [
              {
                ...postCache[0],
                numberOfComments: postCache[0].numberOfComments + 1,
              },
            ]
          );
          // add the new comment to comments array
          const commentsCache = queryClient.getQueryData(["comments"]);
          queryClient.setQueryData(
            ["comments"],
            [{ ...response }, ...commentsCache]
          );
        },
      }
    );
  };

  return (
    <Flex direction="column">
      {user ? (
        <>
          {/* user should  be a link that takes you to your profile */}

          <Text fontSize={{ base: 14, lg: 16 }} mb="4">
            Comment as{" "}
            <a href="#" className="text-blue-500 capitalize hover:underline">
              {user.email.split("@")[0]}
            </a>
          </Text>
          <Textarea
            fontSize={14}
            placeholder="What are your thoughts?"
            height="120px"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Flex justify="end" bg="gray.300">
            <Button
              disabled={!comment.length}
              isLoading={isLoading}
              fontSize={14}
              onClick={onSubmitHandler}
            >
              Comment
            </Button>
          </Flex>
        </>
      ) : (
        <SignupComment />
      )}
    </Flex>
  );
};

export default CommentInput;

const SignupComment = () => {
  return (
    <Flex
      border="1px"
      borderColor="gray.300"
      justify="space-between"
      p="3"
      borderRadius="4"
    >
      <Text fontWeight="bold">Log in or sign up to leave a comment</Text>
      <HStack>
        <AuthButtons />
      </HStack>
    </Flex>
  );
};
