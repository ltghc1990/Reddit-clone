import { useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Stack,
  Divider,
  Button,
  Image,
  Spinner,
  Input,
} from "@chakra-ui/react";
import RedditFace from "../Layout/Navbar/RedditFace";
import { TripleDotsHorizontal, CakeIcon } from "../Icons";
import moment from "moment";
import Link from "next/link";

import { uploadCommunityIcon } from "../../firebase/firebaseFunctions";
import { useUserAuth } from "../../store/reactQueryHooks";
import { useSelectFile } from "../../store/useSelectFile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useCommunityData } from "../../store/reactQueryHooks";

// About component may render with props.
// no props on refresh so ....
const About = (props) => {
  const queryClient = useQueryClient();
  const selectedFileRef = useRef();
  const { data: user } = useUserAuth();
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const { data, isLoading, error, mutate } = useMutation(uploadCommunityIcon);

  const { data: communityData, communityDataIsLoading } = useCommunityData(
    props.communityData
  );

  const onUpdateImage = () => {
    if (!selectedFile) {
      return;
    }
    mutate(
      { communityData, selectedFile, userId: user.uid },
      {
        onError: (error) => console.log(error),
        onSuccess: () => {
          // invalid query key or manual add the response to the query key
          queryClient.invalidateQueries(["currentCommunity"]);
          // update our array of communities so we can see the icon in our drop down
          queryClient.invalidateQueries(["communitySnippets"]);
        },
      }
    );
  };

  if (communityDataIsLoading) {
    return <></>;
  }

  return (
    <Box position="sticky">
      <Flex
        justify="space-between"
        p="3"
        color="white"
        bg="blue.400"
        borderRadius="4px 4px 0px 0px"
      >
        <Text>About Community</Text>
        <Icon as={TripleDotsHorizontal} />
      </Flex>
      <Stack bg="white" p="3" borderRadius="0px 0px 4px 4px">
        <Flex>
          <Flex direction="column" flexGrow="1" fontWeight="bold">
            <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
            <Text>Members</Text>
          </Flex>
          <Flex direction="column" flexGrow="1" fontWeight="bold">
            <Text>1</Text>
            <Text>Online</Text>
          </Flex>
        </Flex>
        <Divider />
        <Flex>
          <Icon as={CakeIcon} />
          <Text ml="2">
            Created{" "}
            {moment(new Date(communityData?.createdAt?.seconds * 1000)).format(
              "MMM DD, YYYY"
            )}
          </Text>
        </Flex>
        <Link href={`/r/${communityData?.id}/submit`}>
          <Button mt="3">Create Post</Button>
        </Link>
        {user?.uid === communityData?.creatorId && (
          <>
            <Divider />
            <Stack spacing="1" fontSize="10">
              <Text fontWeight="600">Admin</Text>
              <Flex align="center" justify="space-between">
                <Text
                  color="blue.500"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => selectedFileRef.current?.click()}
                >
                  Change Image
                </Text>
                {communityData?.imageURL || selectedFile ? (
                  <Box
                    maxW="12"
                    maxH="12"
                    overflow="hidden"
                    border="2px"
                    borderRadius="full"
                    borderColor="gray.200"
                  >
                    <Image
                      src={selectedFile || communityData?.imageURL}
                      alt="community image"
                      objectFit="cover"
                    />
                  </Box>
                ) : (
                  <Icon as={RedditFace} />
                )}
              </Flex>
              {selectedFile &&
                (isLoading ? (
                  <Spinner />
                ) : (
                  <Text cursor="pointer" onClick={onUpdateImage}>
                    Save Changes
                  </Text>
                ))}
              <Input
                ref={selectedFileRef}
                id="file-upload"
                type="file"
                hidden
                onChange={onSelectFile}
              />
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default About;
