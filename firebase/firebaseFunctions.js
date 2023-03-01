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
  limit,
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
    isModerator: user?.uid === communityData.creatorId,
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

// export const uploadCommunityIcon = async ({ communityData, selectedFile }) => {
//   const imageRef = ref(storage, `communities/${communityData.id}/image`);
//   await uploadString(imageRef, selectedFile, "data_url");

//   const downloadURL = await getDownloadURL(imageRef);

//   const communityDocRef = doc(firestore, "communities", communityData.id);

//   await updateDoc(communityDocRef, {
//     imageURL: downloadURL,
//   });
// };

export const uploadCommunityIcon = async ({
  communityData,
  selectedFile,
  userId,
}) => {
  const batch = writeBatch(firestore);
  const imageRef = ref(storage, `communities/${communityData.id}/image`);
  await uploadString(imageRef, selectedFile, "data_url");

  const downloadURL = await getDownloadURL(imageRef);

  const communityDocRef = doc(firestore, "communities", communityData.id);

  batch.update(communityDocRef, {
    imageURL: downloadURL,
  });

  const userSnippetsdocRef = doc(
    firestore,
    "users",
    userId,
    "communitySnippets",
    communityData.id
  );

  batch.update(userSnippetsdocRef, { imageURL: downloadURL });
  await batch.commit();
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
  // the users votevalue in the postValues sub collection
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
  const docRef = doc(firestore, "posts", `${id}`);
  const data = await getDoc(docRef);
  return [{ ...data.data() }];
};

// comments have a prop of the post id

// fetch all comments from the "comments" collection where the field "postId" matches the id of the post
export const fetchComments = async (collectionArg, field, id) => {
  // need to have an extra arg to toggle orderBy list
  const colRef = collection(firestore, collectionArg);

  const commentsQuery = query(
    colRef,
    where(field, "==", id),
    orderBy("createdAt", "desc")
  );
  const commentDocs = await getDocs(commentsQuery);

  return commentDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// needs to be a batch write since we also have to update the post doc.
// the prop key numberofComments has to be updated
export const createComment = async ({
  selectedPost,
  comment,
  communityId,
  user,
}) => {
  const batch = writeBatch(firestore);

  const commentRef = doc(collection(firestore, "comments"));

  batch.set(commentRef, {
    id: commentRef.id,
    creatorId: user.uid,
    creatorDisplayText: user.email.split("@")[0],
    communityId,
    postId: selectedPost.id,
    postTitle: selectedPost.title,
    text: comment,
    createdAt: serverTimestamp(),
  });

  const postRef = doc(firestore, "posts", selectedPost.id);
  batch.update(postRef, {
    numberOfComments: increment(+1),
  });

  await batch.commit();
  return (await getDoc(commentRef)).data();
};

export const deleteComment = async ({ id, postId }) => {
  // need to also grab the post and lower the comments count
  const commentRef = doc(firestore, "comments", id);
  const postRef = doc(firestore, "posts", postId);

  const batch = writeBatch(firestore);
  batch.delete(commentRef);
  batch.update(postRef, { numberOfComments: increment(-1) });

  await batch.commit();
  return id;
};

// fetch the top 10 most voted posts

export const fetchPopularPosts = async () => {
  console.log("no user fetch posts");
  const colRef = collection(firestore, "posts");
  const postQuery = query(colRef, orderBy("voteStatus", "desc"), limit(10));
  const postDocs = await getDocs(postQuery);

  return postDocs.docs.map((doc) => ({ ...doc.data() }));
};

export const fetchUserHomeFeed = async (userUid) => {
  // get posts from users communities\
  // grab users communities, if no communities exist then do a generic feed
  const usersCommunitiesSnippets = await getDocs(
    collection(firestore, "users", userUid, "communitySnippets")
  );
  if (usersCommunitiesSnippets) {
    console.log("fetch users joined communites feed");
    // const snippetsArray = usersCommunitiesSnippets.docs.map(
    //   (doc) => ({ communityId } = doc.data())
    // );
    const snippetsArray = usersCommunitiesSnippets.docs.map((item) => {
      return item.data().communityId;
    });
    const postQuery = query(
      collection(firestore, "posts"),
      where("communityId", "in", snippetsArray),
      limit(10)
    );

    const postDocs = await getDocs(postQuery);
    return postDocs.docs.map((doc) => ({ ...doc.data() }));
  } else {
    console.log("fetchGenericFeed because the user has no joined communites");
    return fetchPopularPosts();
  }
};

export const getCommunityReccomendations = async () => {
  // grab top 5 communities with most members
  const colRef = collection(firestore, "communities");
  const fetchQuery = query(
    colRef,
    orderBy("numberOfMembers", "desc"),
    limit(5)
  );
  const communityDocs = await getDocs(fetchQuery);
  return communityDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
