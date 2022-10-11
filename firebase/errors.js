// basically a key value pairing where we give a more meaningful message

// the error message from firebase is returned as JSON
export const FIREBASE_ERRORS = {
  "Firebase: Error (auth/email-already-in-use).":
    " A user with that email already exist",
  "Firebase: Error (auth/user-not-found).": "invalid email or password",
  "Firebase: Error (auth/wrong-password).": "invalid email or password",
};
