import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ArrowUpRight } from "../components/Layout/Navbar/RightContent/Icons";

import { Button } from "@chakra-ui/react";
import { useUserAuth } from "../store/reactQueryHooks";

import { useMutation, useQuery } from "@tanstack/react-query";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
const Test = () => {
  const { data: user } = useUserAuth();
  const { data: communityData } = useQuery(["stuff"], getCommunityData);
  const { data, error, mutate } = useMutation(joinCommunity, {
    onSuccess: (response) => {
      console.log("test to check onSuccess response", response);
    },
  });

  const onClickHandler = () => {
    mutate(
      { communityData: communityData, user: user },
      {
        onSuccess: (lol) => {
          console.log("mutate click", lol);
        },
      }
    );
  };
  return (
    <div className="flex border-4 border-red-400 ">
      <div className="border-2 border-green-500 ">Hello world</div>
      {/* <button className="p-2 text-white bg-blue-500 rounded-lg">Submit</button> */}
      <Button onClick={onClickHandler}>Click</Button>
    </div>
  );
};

export default Test;

// test to see if we can use the response on onsuccess when we pass the params to mutate

const getCommunityData = async () => {
  const docRef = doc(firestore, "communities", "budgetKeebs");
  const communityDoc = await getDoc(docRef);
  const data = { id: communityDoc.id, ...communityDoc.data() };

  return data;
};

const joinCommunity = async ({ communityData, user }) => {
  // need the communityid we are joining

  const batch = writeBatch(firestore);

  // do not use spread as there are properties that we do not want to copy
  const newSnippet = {
    communityId: communityData.id,
    imageURL: communityData.imageURL || "",
  };

  // add the snippet to our user and also increment the community
  batch.set(
    doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
    newSnippet
  );

  await batch.commit();
  return newSnippet;
};
