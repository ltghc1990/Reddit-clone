import React, { createContext, useState } from "react";

export const AuthModalContext = createContext();
// typescript would help visualise what our options can be here, our view can only be "login", "signup" or "resetPassword" but we wouldnt know that without hints/comments

const AuthModalProvider = ({ children }) => {
  const [modalSettings, setModalSettings] = useState({
    open: false,
    view: "login",
  });

  return (
    <AuthModalContext.Provider value={{ modalSettings, setModalSettings }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export default AuthModalProvider;
