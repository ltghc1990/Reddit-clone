import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ArrowUpRight } from "../components/Layout/Navbar/RightContent/Icons";

import { Button } from "@chakra-ui/react";
import { useUserAuth, useCommunityData } from "../store/reactQueryHooks";
import { useSelectedContext } from "../store/SelectedPostProvider";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  writeBatch,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
const Test = (props) => {
  console.log(props);
  const { selectedPost, setSelectedPost } = useSelectedContext();

  const onClickHandler = async () => {
    setSelectedPost("checky");
  };
  return (
    <div className="flex border-4 border-red-400 ">
      <div className="border-2 border-green-500 ">Hello world</div>
      {/* <button className="p-2 text-white bg-blue-500 rounded-lg">Submit</button> */}
      <Button onClick={onClickHandler}>Click</Button>
      {selectedPost}
    </div>
  );
};

export default Test;
// export async function getServerSideProps(context) {
//   const queryId = context.query;
//   return {
//     props: {
//       queryId,
//     },
//   };
// }
