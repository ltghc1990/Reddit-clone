import React, { useContext } from "react";
import { Button } from "@chakra-ui/react";

import { AuthModalContext } from "../../../../store/AuthModalProvider";

const AuthButtons = () => {
  const { setModalSettings } = useContext(AuthModalContext);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        borderRadius="full"
        p="4"
        display={{
          base: "none",
          sm: "flex",
        }}
        onClick={() => setModalSettings({ open: true, view: "login" })}
      >
        Log In
      </Button>
      <Button
        height="28px"
        borderRadius="full"
        p="4"
        display={{
          base: "none",
          sm: "flex",
        }}
        onClick={() => setModalSettings({ open: true, view: "signup" })}
      >
        Sign Up
      </Button>
    </>
  );
};

export default AuthButtons;
