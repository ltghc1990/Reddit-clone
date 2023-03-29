import React from "react";
import { Box, Text } from "@chakra-ui/react";

import { useCommunityData } from "../../../store/reactQueryHooks";

import PageContent from "../../../components/Layout/PageContent";
import NewPostForm from "../../../components/Posts/NewPostForm";
import About from "../../../components/community/About";

const SubmitPostPage = () => {
  const { data, isLoading, error } = useCommunityData();

  // about commponent mounts, unmounts, mounts again causing flicker
  // has something to do with the layout key making it do that
  // and the only reason why I have the key is so that react query doesnt break
  return (
    <PageContent>
      <>
        <Box borderBottom="1px solid white">
          <Text
            fontWeight="700"
            color="gray.600"
            fontSize={{ base: "md", md: "lg" }}
            mx={{ base: 2, sm: "unset" }}
          >
            Create a Post
          </Text>
        </Box>
        <NewPostForm communityImageURL={data?.imageURL} />
      </>
      <>{!isLoading && <About communityData={data} />}</>
    </PageContent>
  );
};

export default SubmitPostPage;
