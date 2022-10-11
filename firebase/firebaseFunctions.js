import { auth, firestore } from "./clientApp";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export const addCommunityName = async (communityName, error) => {
  const communityRef = doc(firestore, "communities", communityName);
  const communityDoc = await getDoc(communityRef);
  // see if the doc act exist
  if (communityDoc.exists()) {
    error(`Sorry, r/${communityName} is taken. Try another.`);
    return;
  }

  // create doc, by using setDoc, we can generate a unique id and add it as a prop
  // if the doc exist it'll overwrite to props
  await setDoc(communityRef, {});
};

// check if the community exist in the firebase before any creation
