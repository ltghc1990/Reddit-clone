import React, { createContext, useContext, useRef, useState } from "react";

const CommunityMenuContext = createContext();
// This only exist because I need to open the community menu, which is in the nav, from a component futher down.

const CommunityMenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef();

  const toggleCommunityMenu = (e) => {
    e?.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const openMenu = (e) => {
    buttonRef?.current.scrollIntoView({ inline: "center" });
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <CommunityMenuContext.Provider
      value={{
        isOpen,
        toggleCommunityMenu,
        openMenu,
        closeMenu,
        buttonRef,
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

//  every component that can toggle the Menu needs a stop propation to prevent the global onclick close menu function. We can stop the propagation here by passing the event
