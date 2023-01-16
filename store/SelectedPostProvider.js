import React, { useState, createContext, useContext } from "react";

const SelectedPostContext = createContext();

// also going to contain the users postVotes to check if the user has voted before

const SelectedPostProvider = ({ children }) => {
  const [selectedPost, setSelectedPost] = useState();
  const [userPostVotes, setUserPostVotes] = useState();
  return (
    <SelectedPostContext.Provider
      value={{ selectedPost, setSelectedPost, userPostVotes, setUserPostVotes }}
    >
      {children}
    </SelectedPostContext.Provider>
  );
};
export const useSelectedContext = () => {
  return useContext(SelectedPostContext);
};

export default SelectedPostProvider;

// place the setSelectedPost in the postitems instead of passing it
