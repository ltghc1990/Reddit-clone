import React from "react";
import { Box, Text } from "@chakra-ui/react";

import { useCommunityData } from "../../../store/reactQueryHooks";

import PageContent from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Posts/NewPostForm";

const SubmitPostPage = () => {
  const { data, isLoading, error } = useCommunityData();
  console.log(data);
  return (
    <PageContent>
      <>
        <Box borderBottom="1px solid white">
          <Text
            fontWeight="700"
            color="gray.600"
            fontSize={{ base: "md", md: "lg" }}
          >
            Create a Post
          </Text>
        </Box>
        <NewPostForm />
      </>
      <></>
    </PageContent>
  );
};

export default SubmitPostPage;
