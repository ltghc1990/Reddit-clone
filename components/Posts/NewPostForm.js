import {
  Flex,
  Icon,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import React, { useState } from "react";

import {
  DocumentIcon,
  LinkIcon,
  MicrophoneIcon,
  PhotoIcon,
  PollIcon,
} from "../Icons";

import { useRouter } from "next/router";
import { firestore, storage } from "../../firebase/clientApp";
import {
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useMutation } from "@tanstack/react-query";
import { useUserAuth } from "../../store/reactQueryHooks";
import { useSelectFile } from "../../store/useSelectFile";

import ImageUpload from "./PostForm/ImageUpload";
import TextInputs from "./PostForm/TextInputs";

const formTabs = [
  { title: "Post", icon: DocumentIcon },
  { title: "Photo", icon: PhotoIcon },
  { title: "Link", icon: LinkIcon },
  { title: "Poll", icon: PollIcon },
  { title: "Microphone", icon: MicrophoneIcon },
];

// the state from the tab lives here
const NewPostForm = ({ communityImageURL }) => {
  const { data: user } = useUserAuth();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(formTabs[0]);
  const currentIndex = formTabs.findIndex((item) => item === selectedTab);

  const [textInputs, setTextInputs] = useState({ title: "", body: "" });

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

  const {
    data: postResponse,
    isLoading,
    error,
    mutate,
  } = UseCreateNewPostMutation();

  const onTextChange = (e) => {
    setTextInputs({ ...textInputs, [e.target.name]: e.target.value });
  };

  const handleCreatePost = async () => {
    const userId = user.uid;
    const { communityId } = router.query;
    // we add the image afterwards that way if the post doesnt get created, there wouldnt be a random image in storage

    const newPost = {
      creatorId: userId,
      communityImageURL: communityImageURL || "",
      communityId,
      creatorDisplayName: user?.email?.split("@")[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp(),
    };
    // send object to reactQuery mutation
    mutate(newPost, {
      onError: (error) => console.log(error),
      onSuccess: async (response) => {
        // firebase returns the docRef as a response
        console.log(
          "successfully added new post to firebase collection posts.",
          response
        );
        if (selectedFile) {
          // second param is the path in which we want to store our image
          const imageRef = ref(storage, `post/${response.id}/image`);
          // upload selectedFile to the imageRef, 3rd param is the format of the image
          await uploadString(imageRef, selectedFile, "data_url");
          // grab the image url from storage and put it in our post collection
          const downloadURL = await getDownloadURL(imageRef);

          await updateDoc(response, {
            imageURL: downloadURL,
          });
          console.log("post collection has been updated with the image url");
        }
        router.back();
        // I dont think we need to invalidate the post key because router.back() causes a refresh
      },
    });
  };

  return (
    <Flex direction="column" bgColor="white" mt="2">
      <Flex>
        {formTabs.map((item, index) => {
          return (
            <Flex
              key={item.title}
              p="2"
              py={{ lg: 3 }}
              cursor="pointer"
              onClick={() => setSelectedTab(formTabs[index])}
              flexGrow="1"
              _hover={{ bg: "gray.50" }}
              role="group"
              fontWeight="700"
              borderColor="gray.200"
              borderWidth="0px 1px 2px 0px"
              borderBottomColor={index === currentIndex && "blue.500"}
            >
              <Flex
                mx="auto"
                color={index === currentIndex ? "blue.500" : "gray.500"}
                // _groupHover={{ color: "gray.800" }}
                _groupHover={index !== currentIndex && { color: "gray.800" }}
              >
                <Icon as={item.icon} />
                <Text>{item.title}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      {selectedTab.title === "Post" && (
        <TextInputs
          textInputs={textInputs}
          onTextChange={onTextChange}
          handleCreatePost={handleCreatePost}
          isLoading={isLoading}
        />
      )}

      {selectedTab.title === "Photo" && (
        <ImageUpload
          selectedFile={selectedFile}
          removeImage={() => setSelectedFile("")}
          onSelectImage={onSelectFile}
          setSelectedTab={() => setSelectedTab(formTabs[0])}
        />
      )}
      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>Error creating post</AlertDescription>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;

// this should really be moved to firebaseFunction or reactQueryHooks
const UseCreateNewPostMutation = () => {
  const firebaseMutation = async (post) => {
    const docRef = doc(collection(firestore, "posts"));
    await setDoc(docRef, {
      ...post,
      id: docRef.id,
    });
    return docRef;
  };

  const queryObject = useMutation(firebaseMutation);
  return queryObject;
};
