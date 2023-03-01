import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  useRef,
} from "react";

const CommunityMenuContext = createContext();
// This only exist because I need to open the community menu, which is in the nav, from a component futher down.

const CommunityMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCommunityMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <CommunityMenuContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleCommunityMenu,
        closeMenu,
      }}
    >
      {children}
    </CommunityMenuContext.Provider>
  );
};

export const useCommunityMenu = () => {
  return useContext(CommunityMenuContext);
};

export default CommunityMenuProvider;

// PROBLEM
// This think remains open if we click outside of it..

// Fix
//  Ive set a on click to the very top parent that sets setIsOpen(false). then in the menu commponent I have a onclick that stops propagation so when we click on the menu it stops the top parents onclick
