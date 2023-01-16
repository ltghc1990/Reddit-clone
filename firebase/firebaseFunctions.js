import { useState } from "react";
import { auth, firestore, storage } from "./clientApp";

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
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";

import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

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

export const joinCommunity = async (communityData, user) => {
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

  batch.update(doc(firestore, "communities", communityData.id), {
    numberOfMembers: increment(1),
  });

  await batch.commit();
};

// using batch writes since we are mutating 2 collections
export const leaveCommunity = async (communityId, user) => {
  const batch = writeBatch(firestore);

  batch.delete(
    doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
  );

  batch.update(doc(firestore, "communities", communityId), {
    numberOfMembers: increment(-1),
  });

  await batch.commit();
};

// fetch Posts from the community
export const fetchPosts = async (communityData) => {
  const colRef = collection(firestore, "posts");
  // our query functions much like the collectionRef where you can plug it in to getDocs and find what your looking for

  // remember to enable indexing on the firebase website or else this isnt going to work
  const postsQuery = query(
    colRef,
    where("communityId", "==", communityData.id),
    orderBy("createdAt", "desc")
  );

  const postDocs = await getDocs(postsQuery);

  return postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// POST RELATED FIREBASE FUNCTIONS

export const onDeletePost = async (post) => {
  // if an image exist in the post delete it first
  if (post.imageURL) {
    const imageRef = ref(storage, `post/${post.id}/image`);
    await deleteObject(imageRef);
    console.log("image deleted");
  }
  const colRef = collection(firestore, "posts");
  const postDocRef = doc(colRef, post.id);
  await deleteDoc(postDocRef);
};

export const uploadCommunityIcon = async ({ communityData, selectedFile }) => {
  const imageRef = ref(storage, `communities/${communityData.id}/image`);
  await uploadString(imageRef, selectedFile, "data_url");

  const downloadURL = await getDownloadURL(imageRef);

  const communityDocRef = doc(firestore, "communities", communityData.id);

  await updateDoc(communityDocRef, {
    imageURL: downloadURL,
  });
};

export const onPostVote = async ({
  post,
  voteValue,
  communityId,
  existingVoteValue,
  user,
}) => {
  const postRef = doc(firestore, "posts", `${post.id}`);
  const userPostRef = doc(firestore, "users", `${user}/postVotes/${post.id}`);

  const batch = writeBatch(firestore);
  // since batch doesnt return a response we need to manually return data to update the cache after mutate. we need to do this to not force a refetch of all posts, and users posteVotes.

  // 2 things that need to be replaced /returned;
  // the users votevalue in the postValue sub collection
  // the communitys voteStatus

  let returnObject = {
    voteObject: {
      id: post.id,
      // id: postID
      // voteValue: 1 / -1  if voteValue doesnt exist we are removing the vote, we return the id inorder to do the filter method for removal
    },
    postVoteStatus: post.voteStatus,
  };

  if (existingVoteValue === null) {
    // vote value determines if we are downvoting or upvoting
    const voteObject = {
      id: post.id,
      voteValue: voteValue,
    };
    const newPostVotestatus = post.voteStatus + voteValue;
    batch.set(userPostRef, voteObject);
    batch.update(postRef, { voteStatus: newPostVotestatus });
    returnObject = {
      voteObject,
      postVoteStatus: newPostVotestatus,
    };
  } else {
    if (existingVoteValue === voteValue) {
      // 1 === 1 or -1 === -1 means that we are removing vote
      batch.delete(userPostRef);

      const updatedVoteStatus = post.voteStatus - voteValue;
      batch.update(postRef, { voteStatus: updatedVoteStatus });
      returnObject = {
        voteObject: { ...returnObject.voteObject },
        postVoteStatus: updatedVoteStatus,
      };
    } else {
      // replace existing user vote with the voteValue
      // flip the vote means that the post vote status goes up by 2 or down by 2
      batch.update(userPostRef, { voteValue: voteValue });
      const updatedPostVoteStatus = post.voteStatus + voteValue * 2;
      batch.update(postRef, { voteStatus: updatedPostVoteStatus });
      returnObject = {
        voteObject: { ...returnObject.voteObject, voteValue: voteValue },
        postVoteStatus: updatedPostVoteStatus,
      };
    }
  }

  await batch.commit();
  return returnObject;
};

// fetches all the postvotes of the user
// it would be less taxing if we only pulled the postsvotes from the community that we are in but.. this works for when we are in the "all" community
export const fetchUserPostVotes = async (user) => {
  // grab all users postvote data?
  //  have to since we need it visually in order to show upvoted/downvote css
  const colfRef = collection(firestore, `users/${user}/postVotes`);
  const postVotesDocs = await getDocs(colfRef);
  return postVotesDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const fetchSinglePost = async (id) => {
  console.log(id);
  const docRef = doc(firestore, "posts", `${id}`);

  const data = await getDoc(docRef);

  const dataTest = { ...data.data() };

  return dataTest;
};
