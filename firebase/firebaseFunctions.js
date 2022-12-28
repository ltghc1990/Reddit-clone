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

export const onPostVote = async (
  post,
  voteValue,
  communityId,
  userPostVotes,
  existingVote
) => {
  const postRef = doc(firestore, "posts", `${post.id}`);
  const userPostRef = doc(firestore, "users", `${user.id}/${post.id}`);
  const batch = writeBatch(firestore);

  await batch.commit();
};

export const fetchUserPostVotes = async (user) => {
  // grab all users postvote data?
  //  have to since we need it visually in order to if they upvoted or not

  const colfRef = collection(firestore, `users/${user.uid}/postVotes`);
  const postVotesDocs = await getDocs(colfRef);

  return postVotesDocs.docs.map((doc) => ({ ...data.doc, id: doc.id }));
};
