import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
  Text,
  Input,
  Flex,
  Box,
  Stack,
  Checkbox,
  Icon,
} from "@chakra-ui/react";

import { useState } from "react";
import { useRouter } from "next/router";
import { useMutationCommunity } from "../../../store/reactQueryHooks";

const CreateCommunityModal = ({ open, handleClose, toggleCommunityMenu }) => {
  const router = useRouter();
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");

  const { isLoading, error: queryError, mutate } = useMutationCommunity();

  const onChangeHandler = (e) => {
    // subtract the char limit of 21
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    setCharsRemaining(21 - e.target.value.length);
  };

  const onCommunityTypeChange = (e) => {
    setCommunityType(e.target.name);
  };

  const createCommunityHandler = async (e) => {
    if (error) setError("");
    // this format string does not remove the space at the end leading to incorrect routing.
    const format = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community names must be between 3-21 characters, and can only contain letters numbers, or underscores"
      );
      return;
    }

    //  after validation create the community wuth firestore

    mutate(
      { communityName, communityType },
      {
        onError: (error) => {
          console.log(error);
          setError(error.message);
        },
        onSuccess: () => {
          router.push(`/r/${communityName}`);
          toggleCommunityMenu(e);
        },
      }
    );
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={15}>Create a community</ModalHeader>
          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Text fontWeight="bold">Name</Text>
            <Text fontSize={14}>
              Community names including capitalization cannot be changed
            </Text>
            <Box position="relative" mt="6">
              <Flex
                position="absolute"
                color="gray.500"
                height="full"
                px="4"
                align="center"
              >
                r/
              </Flex>
              <Input pl="10" onChange={onChangeHandler} value={communityName} />
            </Box>

            <Text mb="6" color={charsRemaining === 0 ? "red" : "gray.500"}>
              Characters remaining: {charsRemaining}
            </Text>

            <Text fontSize={12} color="red">
              {error || queryError?.message}
            </Text>

            <Box mb="6">
              <Text fontWeight="bold">Community Type</Text>
              <Stack>
                <Checkbox
                  name="public"
                  isChecked={communityType === "public"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={PublicIcon} />
                    <Text fontSize={14} mr="1">
                      Public
                    </Text>
                    <Text fontSize={10}>
                      Anyone can view, post, and comment to this community
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="restricted"
                  isChecked={communityType === "restricted"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={RestrictedIcon} />
                    <Text fontSize={14} mr="1">
                      Restricted
                    </Text>
                    <Text fontSize={10}>
                      anyone can view this community, but only for approved
                      users can post
                    </Text>
                  </Flex>
                </Checkbox>
                <Checkbox
                  name="private"
                  isChecked={communityType === "private"}
                  onChange={onCommunityTypeChange}
                >
                  <Flex align="center">
                    <Icon as={PrivateIcon} />
                    <Text fontSize={14} mr="1">
                      Private
                    </Text>
                    <Text fontSize={10}>
                      Only approved users can view and submit in this community
                    </Text>
                  </Flex>
                </Checkbox>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              colorScheme="blue"
              mr={3}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              onClick={createCommunityHandler}
              isLoading={isLoading}
              variant="ghost"
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCommunityModal;

const PublicIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 mr-2"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const RestrictedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 mr-2"
    >
      <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
      <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
    </svg>
  );
};

const PrivateIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4 mr-2"
    >
      <path
        fillRule="evenodd"
        d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
        clipRule="evenodd"
      />
    </svg>
  );
};
