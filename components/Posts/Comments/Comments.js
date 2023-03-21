import {
  Box,
  Flex,
  Stack,
  SkeletonCircle,
  SkeletonText,
  Text,
} from "@chakra-ui/react";

import { AnimatePresence } from "framer-motion";

import CommentItem from "./CommentItem";

import { fetchComments } from "../../../firebase/firebaseFunctions";
import { useQuery } from "@tanstack/react-query";

const Comments = ({ children, postId, user }) => {
  // children component is CommentInput

  // fetch all comments from the comments collection where the field "postId" matches the id of the post
  const { data, isLoading } = useQuery(
    ["comments"],
    () => fetchComments("comments", "postId", postId),
    {
      enabled: Boolean(postId),
      onError: (error) => console.log(error),
      onSuccess: (comments) => console.log("comments fetched", comments),
    }
  );

  // if loading is true show skeleton
  // if not true and the comments is an empty array show no comments
  return (
    <Box borderRadius="0px 0px 4px 4px" bg="white" p={{ base: 4, lg: 8 }}>
      <Flex direction="column" mb="6">
        {!isLoading && children}
      </Flex>
      <Stack spacing={6}>
        {isLoading ? (
          <>
            {[1, 2, 3].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {data?.length === 0 ? (
              <Text
                textAlign="center"
                py="12"
                textColor="gray.500"
                fontWeight="bold"
              >
                No Comments Yet
              </Text>
            ) : (
              <AnimatePresence>
                {data &&
                  data.map((item) => {
                    return <CommentItem key={item.id} {...item} user={user} />;
                  })}
              </AnimatePresence>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Comments;
