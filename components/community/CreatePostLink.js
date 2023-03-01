import React, { useContext } from "react";
import RedditFace from "../Layout/Navbar/RedditFace";

import { AuthModalContext } from "../../store/AuthmodalProvider";
import { useCommunityMenu } from "../../store/CommunityMenuProvider";
import { Flex, Icon, Input, HStack, Box } from "@chakra-ui/react";
import { useUserAuth } from "../../store/reactQueryHooks";
import { useRouter } from "next/router";

const CreatePostLink = () => {
  const { isOpen, setIsOpen, toggleCommunityMenu } = useCommunityMenu();
  const { setModalSettings } = useContext(AuthModalContext);

  const { data: user } = useUserAuth();

  const router = useRouter();
  const { communityId } = router.query;

  const onInputClick = (e) => {
    // need to check if we are in a community
    if (!user) {
      setModalSettings({ open: true, view: "login" });
      return;
    }

    if (!communityId) {
      e.target.blur();
      toggleCommunityMenu();
      return;
    }
    router.push(`${communityId}/submit`);
  };
  return (
    <HStack bg="white" p="2" mb="6">
      <Box cursor="pointer">
        <Icon as={RedditFace} cursor="pointer" />
      </Box>

      <Input
        bg="gray.100"
        placeholder="Create Post"
        _hover={{ backgroundColor: "white" }}
        onClick={onInputClick}
      />

      <Box
        _hover={{ backgroundColor: "gray.100" }}
        borderRadius="md"
        p="1"
        cursor="pointer"
      >
        <Icon as={PhotoIcon} />
      </Box>

      <Box
        _hover={{ backgroundColor: "gray.100" }}
        borderRadius="md"
        p="1"
        cursor="pointer"
      >
        <Icon as={LinkIcon} />
      </Box>
    </HStack>
  );
};

export default CreatePostLink;

const LinkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
};

const PhotoIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
};
