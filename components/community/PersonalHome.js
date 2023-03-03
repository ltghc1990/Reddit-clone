import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import RedditFace from "../Layout/Navbar/RedditFace";

import CreateCommunityModal from "../Modal/CreateCommunity/CreateCommunityModal";
import { useCommunityMenu } from "../../store/CommunityMenuProvider";

const PersonalHome = () => {
  const [openCreateCommunity, setOpenCreateCommunity] = useState(false);

  const { openMenu } = useCommunityMenu();

  return (
    <>
      <Flex direction="column" bgColor="white">
        <Flex
          w="100%"
          bgImage="url(/images/homeBanner.png)"
          h="50px"
          backgroundSize="cover"
          backgroundPosition="center"
          bgRepeat="no-repeat"
          borderRadius="4px 4px 0px 0px"
        />
        <Flex direction="column" px="4">
          <Flex align="center" mt="2">
            <Box m="2">
              <Icon as={() => RedditFace({ size: "38px" })} />
            </Box>
            <Text fontWeight="bold">Home</Text>
          </Flex>
          <Text my="2" fontSize="12" fontWeight={600} textColor="gray.700">
            Your personal Reddit frontpage, built for you.
          </Text>

          <Button
            borderRadius="full"
            bgColor="blue.500"
            color="white"
            h="36px"
            my="2"
            _hover={{ bgColor: "blue.600" }}
            onClick={openMenu}
          >
            Create Post
          </Button>
          <Button
            onClick={() => setOpenCreateCommunity(true)}
            borderRadius="full"
            h="36px"
            my="2"
            color="blue.500"
          >
            Create Community
          </Button>
        </Flex>
      </Flex>
      <CreateCommunityModal
        open={openCreateCommunity}
        handleClose={() => setOpenCreateCommunity(false)}
      />
    </>
  );
};

export default PersonalHome;
