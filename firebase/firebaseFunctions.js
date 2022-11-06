import { auth, firestore } from "./clientApp";

// Alot of the auth firebase functions are in the reactQueryHooks file

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  runTransaction,
  writeBatch,
  increment,
} from "firebase/firestore";

// not really reusable, we are passing props instead of just having the function in the component itself; mainly becuase I like to keep my functions separate from the component
export const addCommunityName = async (
  communityName,
  error,
  userUid,
  communityType
) => {
  const communityRef = doc(firestore, "communities", communityName);

  await runTransaction(firestore, async (transaction) => {
    // see if the doc act exist
    const communityDoc = await transaction.get(communityRef);
    if (communityDoc.exists()) {
      error(`Sorry, r/${communityName} is taken. Try another.`);
      return;
    }
    //  create community after validation
    transaction.set(communityRef, {
      creatorId: userUid,
      createdAt: serverTimestamp(),
      numberOfMembers: 1,
      privacyType: communityType,
    });

    //  now we have to update the user who created the community
    // using doc is like starting at the root of your collection
    // collection/doc/subcollection/doc
    transaction.set(
      doc(firestore, `users/${userUid}/communitySnippets/`, communityName),
      {
        communityId: communityName,
        isModerator: true,
      }
    );
  });
};

export const fetchCommunities = async () => {
  const collectionRef = collection(firestore, "test");
  const response = await getDocs(collectionRef);

  const data = response.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
  return data;
};

export const joinCommunity = async (communityData) => {
  // need the communityid we are joining
  const batch = writeBatch(firestore);

  // do not use spread as there are properties that we do not want to copy

  const newSnippet = {
    communityId: communityData.id,
    imageURL: communityData.imageURL || "",
  };
  // find a way to get the user id so that we can put the community snippets in

  // add the snippet to our user and also increment the community
  batch.set(
    doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
    newSnippet
  );

  batch.update(doc(firestore, "communities", communityData.id), {
    numberOfMembers: increment(1),
  });

  await batch.commit();

  // need to test if the fucntion is intialized and will send the correct info
};

// using batch writes since we are mutating 2 collections
export const leaveCommunity = async (communityId) => {
  const batch = writeBatch(firestore);

  batch.delete(
    doc(firestore, `users/${user.uid}/communitySnippets/${communityId}`)
  );

  batch.update(doc(firestore, "communities", communityId), {
    numberOfMembers: increment(-1),
  });

  await batch.commit();
};
