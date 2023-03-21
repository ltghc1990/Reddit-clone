import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment/moment";

import { motion } from "framer-motion";

import RedditFace from "../../Layout/Navbar/RedditFace";
import { ArrowDownCircleIcon, ArrowUpCircleIcon, TrashIcon } from "../../Icons";

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
    <Flex
      as={motion.div}
      layout
      transition={{ duration: 0.5, type: "ease-in-out" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box>
        <Icon as={RedditFace} />
      </Box>
      <Box px="3" py="2" width="full">
        <Flex align="center" fontSize="12" mb="2" textColor="gray.700">
          <Text fontWeight="bold">{creatorDisplayText}</Text>
          <Box as="span" mx="1">
            &middot;
          </Box>
          <Text fontWeight="500">
            {" "}
            {moment(new Date(createdAt?.seconds * 1000)).fromNow()}
          </Text>
        </Flex>

        <Box>
          <Text fontSize="14">{text}</Text>
        </Box>

        <Flex textColor="gray.500" my="2" align="center">
          <Box cursor="pointer">
            <Icon as={ArrowUpCircleIcon} />
          </Box>
          <Text px="1">0</Text>

          <Box cursor="pointer">
            <Icon as={ArrowDownCircleIcon} />
          </Box>
          {isCreator && (
            <Flex
              align="center"
              p="2"
              ml="2"
              cursor="pointer"
              fontSize="12"
              borderRadius="lg"
              onClick={() => mutate({ id, postId })}
              isloading={isloading}
              _hover={{ color: "gray.700", bg: "gray.100" }}
            >
              <Icon as={TrashIcon} />
              <Text>Delete</Text>
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default CommentItem;
