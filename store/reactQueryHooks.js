import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { auth } from "../firebase/clientApp";

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

// firebase create email/password
export const useCreateUserWithEmail = () => {
  const { data, isLoading, error, mutate } = useMutation((data) =>
    createUserWithEmailAndPassword(auth, data.email, data.password)
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

// sign in using google auth function using popup, close the modal + also reroute

export const useGoogleAuth = () => {
  const { setModalSettings } = useContext(AuthModalContext);
  const provider = new GoogleAuthProvider();
  const { data, isLoading, error, mutate } = useMutation(
    () => signInWithPopup(auth, provider),
    {
      onSuccess: (data) => {
        setModalSettings((prev) => ({ ...prev, open: false }));
        console.log("used google auth to sign in", data);
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
        console.log(data);
        if (data !== null && modalSettings.open === true) {
          setModalSettings((prev) => ({ ...prev, open: false }));
        }
      },
    }
  );

  return { data, isLoading, error };
};

export const userAuthSideEffect = () => {
  // if the user exist, autoclose the modal
  const { data } = useUserAuth;
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

// QueryKeys
//  'user' = authdetails

// have a onAuthchange function that refreshes the react query key auth whenever the auth changes.

// since useMutation doesnt auto invalidate keys we use this
// sticking this in the navbar
export const useOnAuthChange = () => {
  const queryClient = useQueryClient();
  const unsubscribe = onAuthStateChanged(auth, () => {
    queryClient.invalidateQueries(["user"]);
    console.log("onAuthChange");
  });
};
