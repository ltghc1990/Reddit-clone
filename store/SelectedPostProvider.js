import React, { useState, createContext, useContext } from "react";

const SelectedPostContext = createContext();
// can
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
