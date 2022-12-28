import React, { useRef } from "react";
import { Button, Flex, HStack, Input, VStack, Image } from "@chakra-ui/react";

const ImageUpload = ({
  selectedFile,
  onSelectImage,
  removeImage,
  setSelectedTab,
}) => {
  const fileRef = useRef();

  const onClickHandler = () => {
    // select the input and click it
    // once clicked the input onchange fires off
    fileRef?.current.click();
  };

  return (
    <Flex justify="center">
      {selectedFile ? (
        <VStack mb="5">
          <Image src={selectedFile} alt="user upload image" my="3" />
          <HStack>
            <Button onClick={setSelectedTab}>Back to Post</Button>
            <Button variant="outline" onClick={removeImage}>
              Remove
            </Button>
          </HStack>
        </VStack>
      ) : (
        <Flex border="1px dashed" borderColor="gray.200" p={20}>
          <Button variant="outline" color="blue.500" onClick={onClickHandler}>
            Upload
          </Button>
          {/* we want to hide the ui of the input and use the button for the ui instead */}
          <Input ref={fileRef} type="file" hidden onChange={onSelectImage} />
        </Flex>
      )}
    </Flex>
  );
};

export default ImageUpload;
