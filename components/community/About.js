import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";

import { aboutMotionParent, aboutMotionChild } from "../../store/motionValues";

import Image from "next/image";

import { useRouter } from "next/router";
import { useContext, useRef } from "react";
import { CakeIcon, TripleDotsHorizontal } from "../Icons";
import RedditFace from "../Layout/Navbar/RedditFace";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadCommunityIcon } from "../../firebase/firebaseFunctions";
import { useUserAuth } from "../../store/reactQueryHooks";
import { useSelectFile } from "../../store/useSelectFile";

import { AuthModalContext } from "../../store/AuthModalProvider";
import { useCommunityData } from "../../store/reactQueryHooks";

// About component may render with currentCommunity props
const About = (props) => {
  const { setModalSettings } = useContext(AuthModalContext);
  const router = useRouter();

  const queryClient = useQueryClient();
  const selectedFileRef = useRef();
  const { data: user } = useUserAuth();
  const { selectedFile, onSelectFile } = useSelectFile();
  const { isLoading, error, mutate } = useMutation(uploadCommunityIcon);

  const { data: communityData, isLoading: communityDataIsLoading } =
    useCommunityData(props.communityData);

  const handleCreatePost = () => {
    if (!user) {
      setModalSettings((prev) => ({ ...prev, open: true, view: "login" }));
      return;
    }
    router.push(`/r/${communityData?.id}/submit`);
  };

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

  return (
    <Box {...aboutMotionParent} variants={aboutMotionParent} position="sticky">
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
        <Flex as={aboutMotionChild.as} variants={aboutMotionChild}>
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

        <Flex
          as={aboutMotionChild.as}
          variants={aboutMotionChild}
          height={communityData ? "unset" : "24px"}
        >
          {communityData && (
            <>
              <Icon as={CakeIcon} />
              <Text ml="2">
                Created{" "}
                {moment(
                  new Date(communityData?.createdAt?.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            </>
          )}
        </Flex>

        <Button onClick={handleCreatePost} mt="3">
          Create Post
        </Button>

        <Box as={aboutMotionChild.as} variants={aboutMotionChild}>
          {!communityDataIsLoading &&
            user?.uid === communityData?.creatorId && (
              <>
                <Divider />
                <Stack spacing="1" fontSize="10" mt="2">
                  <Flex align="center" justify="space-between">
                    <Flex direction="column">
                      <Text fontWeight="600">Admin</Text>
                      <Text
                        color="blue.500"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => selectedFileRef.current?.click()}
                      >
                        Change Image
                      </Text>
                    </Flex>

                    {communityData?.imageURL || selectedFile ? (
                      <Box
                        border="2px"
                        boxSize="42px"
                        overflow="hidden"
                        borderRadius="full"
                        borderColor="gray.200"
                        position="relative"
                      >
                        <Image
                          src={selectedFile || communityData.imageURL}
                          alt="community image"
                          objectFit="cover"
                          layout="fill"
                          position="absolute"
                        />
                      </Box>
                    ) : (
                      <Icon as={() => RedditFace({ size: "42px" })} />
                    )}
                  </Flex>
                  {selectedFile &&
                    (isLoading ? (
                      <Spinner />
                    ) : (
                      <Text
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={onUpdateImage}
                      >
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
        </Box>
      </Stack>
    </Box>
  );
};

export default About;
