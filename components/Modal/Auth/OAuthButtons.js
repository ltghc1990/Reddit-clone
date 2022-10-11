import { Button, Flex, Image, Text } from "@chakra-ui/react";

import { useGoogleAuth } from "../../../store/reactQueryHooks";

// import function to close modal

const OAuthButtons = () => {
  const { data, isLoading, error, mutate } = useGoogleAuth();
  const onClick = () => {
    mutate();
  };

  return (
    <Flex justify={"center"} mb="6">
      <Button onClick={onClick}>
        <Image
          src="\images\googleIcon.svg"
          alt="google logo"
          mr="2"
          height={4}
        />
        Continue with Google
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};

export default OAuthButtons;

// need to have an error message below the button
