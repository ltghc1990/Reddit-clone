import React from "react";
import { Flex, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();

  return (
    <Flex direction="column" align="center" mt="24">
      <Text mb="4">
        Sorry, that community does not exist or has been banned
      </Text>
      <>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </>
    </Flex>
  );
};

export default NotFound;
