import React from "react";

import { Textarea, Input, Stack, Flex, Button } from "@chakra-ui/react";

const TextInputs = ({
  textInputs,
  onTextChange,
  handleCreatePost,
  isLoading,
}) => {
  return (
    <Stack spacing={3} p={{ base: 2, md: 4, lg: 6 }}>
      <Input
        fontSize={{ base: "12px", md: "14px", lg: "16px" }}
        placeholder="Title"
        name="title"
        value={textInputs.title}
        onChange={(e) => onTextChange(e)}
      />
      <Textarea
        fontSize={{ base: "12px", md: "14px", lg: "16px" }}
        placeholder="Text (required)"
        name="body"
        height="100px"
        value={textInputs.body}
        onChange={(e) => onTextChange(e)}
      />
      <Flex justify="end">
        <Button
          disabled={!textInputs.title}
          onClick={handleCreatePost}
          isLoading={isLoading}
        >
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
