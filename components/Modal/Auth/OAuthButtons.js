import {
  Button,
  Flex,
  Image,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

import { useGoogleAuth } from "../../../store/reactQueryHooks";

// import function to close modal

const OAuthButtons = () => {
  const { data, isLoading, error, mutate } = useGoogleAuth();
  const onClick = () => {
    mutate();
  };

  return (
    <Flex direction="column" justify="center" align="center" mb="6">
      {error && (
        <Alert status="error" mb="6">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Button onClick={onClick}>
        <Image
          src="\images\googleIcon.svg"
          alt="google logo"
          mr="2"
          height={4}
        />
        Continue with Google
      </Button>
    </Flex>
  );
};

export default OAuthButtons;

// need to have an error message below the button
