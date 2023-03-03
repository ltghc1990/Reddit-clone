import React, { useState, createContext, useContext } from "react";

// hook/context not needed anymore, and isnt being used anywhere in the app

const SelectedPostContext = createContext();

const SelectedPostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState();
  return (
    <SelectedPostContext.Provider value={{ selectedPost, setSelectedPost }}>
      {children}
    </SelectedPostContext.Provider>
  );
};

export const useSelectedContext = () => {
  return useContext(SelectedPostContext);
};

export default SelectedPostProvider;
