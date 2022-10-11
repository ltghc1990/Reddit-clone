import React, { createContext, useContext, useState } from "react";

// might also use react query here
export const AuthModalContext = createContext();

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
