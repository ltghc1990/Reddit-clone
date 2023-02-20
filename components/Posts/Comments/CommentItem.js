import { Box, Flex, Icon, Text, Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";

import RedditFace from "../../Layout/Navbar/RedditFace";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "../../Icons";

import { deleteComment } from "../../../firebase/firebaseFunctions";
const CommentItem = ({
  id,
  createdAt,
  creatorDisplayText,
  creatorId,
  text,
  user,
  postId,
}) => {
  // if the userid match with creatorid show delete/edite function
  const isCreator = user?.uid === creatorId;

  const queryClient = useQueryClient();

  const { isloading, mutate } = useMutation(deleteComment, {
    onSuccess: (id) => {
      // find the comment in the comments array and delete it
      const commentsCache = queryClient.getQueryData(["comments"]);

      const currentComments = commentsCache.filter(
        (comment) => comment.id !== id
      );
      queryClient.setQueryData(["comments"], currentComments);
      // need to also need to -1 on the post comments value
      const singlePostCache = queryClient.getQueryData(["posts", postId]);
      queryClient.setQueryData(
        ["posts", postId],
        [
          {
            ...singlePostCache[0],
            numberOfComments: singlePostCache[0].numberOfComments - 1,
          },
        ]
      );
    },
  });

  return (
    <Flex>
      <Box border="1px">
        <Icon as={RedditFace} />
      </Box>
      <Box px="3">
        <Flex align="center">
          <Text fontWeight="bold" mr="2">
            {creatorDisplayText}
          </Text>
          <Text textColor="gray.500" fontSize="10" fontWeight="600">
            {" "}
            {moment(new Date(createdAt?.seconds * 1000)).fromNow()}
          </Text>
        </Flex>

        <Box>
          <Text>{text}</Text>
        </Box>

        <Flex textColor="gray.500">
          <Box cursor="pointer">
            <Icon as={ArrowUpCircleIcon} />
          </Box>

          <Box cursor="pointer">
            <Icon as={ArrowDownCircleIcon} />
          </Box>
          {isCreator && (
            <Button
              onClick={() => mutate({ id, postId })}
              isloading={isloading}
            >
              Delete
            </Button>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default CommentItem;
