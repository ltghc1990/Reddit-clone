import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, firestore } from "../firebase/clientApp";

// firebase functions
import {
  addCommunityName,
  leaveCommunity,
  joinCommunity,
} from "../firebase/firebaseFunctions";

// used to close modal
import { AuthModalContext } from "./AuthmodalProvider";

// mix of react query and firebase functions
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";

// firebase create email/password
export const useCreateUserWithEmail = () => {
  const { data, isLoading, error, mutate } = useMutation(async (data) => {
    const response = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = response.user;
    // take the response, create a user firestore
    // addDoc creates a uuid, we have to use setDoc in order to set our own id
    const docRef = doc(firestore, "users", user.uid);
    const document = await setDoc(docRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      providerData: user.providerData,
    });
    console.log("added created user to firestore");
  });

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

// sign in using google auth function using popup,
export const useGoogleAuth = () => {
  const provider = new GoogleAuthProvider();
  const { data, isLoading, error, mutate } = useMutation(
    () => signInWithPopup(auth, provider),
    {
      onSuccess: (data) => {
        // with google auth, it handles both logging in and signing up so we have to use setDoc; it'll add it or if it already exist, it'll update it
        const user = data.user;
        const docRef = doc(firestore, "users", user.uid);
        console.log(
          "used google auth to sign in and created/updated user in firestore"
        );
        setDoc(docRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          providerData: user.providerData,
        });
      },
    }
  );

  return { data, isLoading, error, mutate };
};

// firebase login in with email and password
// might be better to pass the email and pw to the useSigninWithUser function to make it more clear that you need to provide it with params in order for it to work.

// currently you have to pass the email/pw as an object to the mutate() function

export const useSignInWithUser = () => {
  // mutate(data)
  const { data, isLoading, error, mutate } = useMutation((data) =>
    signInWithEmailAndPassword(auth, data.email, data.password)
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

// currently not workign as intended/ will not refresh without the onAuthChange function running
export const useUserAuth = () => {
  const { modalSettings, setModalSettings } = useContext(AuthModalContext);
  const { data, isLoading, error } = useQuery(
    ["user"],
    () => auth.currentUser,
    {
      onSuccess: (data) => {
        // close modal because data exist?

        if (data !== null && modalSettings.open === true) {
          setModalSettings((prev) => ({ ...prev, open: false }));
        }
      },
    }
  );

  return { data, isLoading, error };
};

//  fire base auth status
// a subscription that detects when the auth has changed
// if the auth state changes we close the modal

// signing out , need to invalidate auth to cause refresh

export const useSignOut = () => {
  const { data, isLoading, error, mutate } = useMutation(() => signOut(auth), {
    onSuccess: (response) => {
      console.log("signout successful");
    },
  });

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

// have a onAuthchange function that refreshes the react query key auth whenever the auth changes.

// since useMutation doesnt auto invalidate keys we use this
// sticking this in the navbar
export const useOnAuthChange = () => {
  const queryClient = useQueryClient();
  const unsubscribe = onAuthStateChanged(auth, () => {
    queryClient.invalidateQueries(["user"]);
    console.log("A auth Change has occured");
    // clear the user communities if they signed out
    const user = queryClient.getQueryData(["user"]);
    const communityData = queryClient.getQueryData(["communitySnippets"]);

    if (user === null) {
      console.log("user is null");
      queryClient.invalidateQueries(["communitySnippets"]);
    }
  });
};

export const useMutationCommunity = () => {
  //  need user to see who created the community
  // access the user id by using querykey
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  const { isLoading, error, mutate } = useMutation((data) =>
    addCommunityName(
      data.communityName,
      data.setError,
      userData.uid,
      data.communityType
    )
  );

  return {
    isLoading,
    error,
    mutate,
  };
};

// need to add the modal toggle to the onAuthchange and remove it from all sign in / sign out functions for concise-ness

// COMMUNITIES RELATED QUERYS

export const useFetchCommunitySnippets = () => {
  // if logged in, grab community snippets from firebase
  // need the user auth before we can do anything
  const { data: user } = useUserAuth();

  // have to remove enabled prop since its preventing the function from running again when the user is null, causing the header component to not rerender

  const { data, isLoading, error } = useQuery(["communitySnippets"], () =>
    getCommunitySnippets()
  );

  // grab all the communities our user is in
  const getCommunitySnippets = async () => {
    const colRef = collection(firestore, `users/${user.uid}/communitySnippets`);
    const response = await getDocs(colRef);
    const communitySnippets = response.docs.map((doc) => {
      return { ...doc.data() };
    });
    return communitySnippets;
  };
  return {
    data,
    isLoading,
    error,
  };
};

export const useOnJoinorLeaveCommunity = (isJoined) => {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(["user"]);

  // firebase function
  const firebaseMutation = (isJoined) => {
    if (isJoined) {
      // need to do a transaction to remove from users and communities
    }

    // make sure that they are loggd in
  };

  const { data, isLoading, error, mutate } = useMutation(() => lol());
};

const useLeaveCommunity = (communityId) => {
  const { data, isLoading, error, mutate } = useMutation(() =>
    leaveCommunity(communityId)
  );
};

const useJoinCommunity = (communityData) => {
  const { data, isLoading, error, mutate } = useMutation(() =>
    joinCommunity(communityData)
  );
};

// after mutation must invalidate the communitySnippets key

// query keys
// ['user] = the user Auth details
// ['communitySnippets]

// HAVE TO CLEAR THE COMMUNITY SNIPPETS ON LOGOUT
