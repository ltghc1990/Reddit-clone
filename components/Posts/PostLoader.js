import { Box, Stack, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const PostLoader = () => {
  return (
    <Stack>
      <Box padding="10" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText noOfLines={1} mt="4" spacing={4} width="40%" />
        <SkeletonText noOfLines={4} mt="6" spacing={4} />
        <Skeleton mt="4" height="200px" />
      </Box>
      <Box padding="10" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText noOfLines={1} mt="4" spacing={4} width="40%" />
        <SkeletonText noOfLines={4} mt="4" spacing={4} />
        <Skeleton mt="4" height="200px" />
      </Box>
    </Stack>
  );
};

export default PostLoader;
