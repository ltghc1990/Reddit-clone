import { Box, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react";

const Premium = () => {
  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius="4"
      cursor="pointer"
      p="12px"
      boder="1px solid"
      borderColor="gray.300"
    >
      <Flex mb="2" align="center">
        <Box p="2">
          <Icon as={GuardIcon} />
        </Box>

        <Stack fontSize={12} spacing="1">
          <Text fontWeight="bold">Reddit Premium</Text>
          <Text>The best Reddit experience, with monthly Coins</Text>
        </Stack>
      </Flex>
      <Button borderRadius="full" h="36px" color="white" bgColor="red.500">
        Try Now
      </Button>
    </Flex>
  );
};

export default Premium;

const GuardIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="red"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z"
      />
    </svg>
  );
};
